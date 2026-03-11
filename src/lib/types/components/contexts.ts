/**
 * @fileoverview Svelte context type definitions.
 *
 * All context keys are exported as constants to avoid magic strings.
 * Usage pattern:
 *   - Parent: `setContext(CTX_KEY, value)`
 *   - Child:  `getContext<ContextType>(CTX_KEY)`
 *
 * @see https://svelte.dev/docs/svelte#setcontext
 */

// ─── Worker ────────────────────────────────────────────────────────────────────

/** Context key for {@link WorkerInfoContext}. */
export const WORKER_INFO_CTX = 'workerInfo' as const;

/**
 * Aggregated daily statistics for all workers in a company.
 * Set by "src/routes/companies/[userId]/[companyId]/+page.svelte"
 * Displayed by company-summary-cards.svelte
 * Used by company-upgrades-cards.svelte
 * Updated by company-workers.svelte.
 *
 * ## Key formulas
 * ```
 * totalDailyProduction = Σ (dailyActions_i × production_i)
 * totalWages           = Σ (dailyActions_i × production_i × wage_i)
 * ```
 *
 *
 * @example
 * ```ts
 * // Parent (e.g. WorkersDashboard.svelte)
 * import { setContext } from 'svelte';
 * import { WORKER_INFO_CTX, type WorkerInfoContext } from '$lib/types';
 *
 * setContext<WorkerInfoContext>(WORKER_INFO_CTX, {
 *     totalDailyProduction: 1017.6,
 *     totalWages:           136.35,
 * });
 *
 * // Child (e.g. ProductionCard.svelte)
 * import { getContext } from 'svelte';
 * const ctx = getContext<WorkerInfoContext>(WORKER_INFO_CTX);
 * ```
 */
export interface WorkerInfoContext {
	/**
	 * Total production points generated per day across all workers.
	 * `Σ (dailyActions_i × production_i)`
	 * Useful for revenue and unit output.
	 */
	totalDailyProduction: number;

	/**
	 * Estimated total daily wage cost across all workers.
	 * `Σ (dailyActions_i × production_i × wage_i)`
	 * Represents the actual labour cost for a full day of production.
	 */
	totalWages: number;
}

/** Context key for {@link BreakEvenWageContext}. */
export const BREAK_EVEN_WAGE_CTX = 'breakEvenWage' as const;

/**
 * Shared reactive context for the break-even wage calculator.
 * Set by `company-workers-widget.svelte` via `$state` + `setContext`.
 * Written to by `company-wage.svelte` (assigns `getByFidelity` reactively).
 * Read by `company-workers.svelte` and `company-wage.svelte`.
 *
 * ## Shape at initialisation
 * ```ts
 * let breakEvenWage = $state<BreakEvenWageContext>({
 *     wage:           undefined,
 *     getByFidelity:  null,
 * });
 * setContext(BREAK_EVEN_WAGE_CTX, breakEvenWage);
 * ```
 *
 * ## Shape after `company-wage.svelte` mounts
 * ```ts
 * breakEvenWageConnector.wage          = breakEvenWage;          // derived number
 * breakEvenWageConnector.getByFidelity = (fidelity) => { ... };  // assigned function
 * ```
 *
 * @example
 * ```ts
 * // Parent (company-workers-widget.svelte)
 * import { setContext } from 'svelte';
 * import { BREAK_EVEN_WAGE_CTX, type BreakEvenWageContext } from '$lib/types';
 *
 * let breakEvenWage = $state<BreakEvenWageContext>({
 *     wage:          undefined,
 *     getByFidelity: null,
 * });
 * setContext(BREAK_EVEN_WAGE_CTX, breakEvenWage);
 *
 * // Child (company-wage.svelte / company-workers.svelte)
 * import { getContext } from 'svelte';
 * const ctx = getContext<BreakEvenWageContext>(BREAK_EVEN_WAGE_CTX);
 * ```
 */
export interface BreakEvenWageContext {
	/**
	 * Base break-even wage (market price − input cost) / base production output.
	 * `undefined` until `company-wage.svelte` has mounted and computed it.
	 */
	wage: number;

	/**
	 * Returns the break-even wage adjusted for a given fidelity percentage.
	 * Formula: `(marketPrice − inputPrice) / (baseProductionOutput / (1 + fidelity / 100))`
	 *
	 * `null` until `company-wage.svelte` assigns the function after mount.
	 *
	 * @param fidelity - Worker fidelity percentage (0–10).
	 * @returns The fidelity-adjusted break-even wage.
	 */
	getByFidelity: ((fidelity: number) => number) | null;
}
