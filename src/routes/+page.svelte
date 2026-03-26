<script>
	import { onMount } from 'svelte';

	import { getIcon } from '$lib/config/icons';
	import Icon from '$lib/components/atoms/Icon/icon.svelte';

	/** @typedef {import('svelte').Component} SvelteComponent */

	/**
	 * @typedef {Object} Tool
	 * @property {string | SvelteComponent} icon  — emoji string OR a Svelte component (e.g. unplugin-icons)
	 * @property {string} title
	 * @property {string} available
	 * @property {string} description
	 * @property {string} badge
	 * @property {string} color
	 * @property {string} border
	 * @property {string} badgeColor
	 */

	/** @type {Tool[]} */
	const tools = [
		{
			icon: getIcon('battle'),
			title: 'Battle Calculator',
			available: 'Not Available',
			description:
				'Simulate battles with precise unit stats, terrain bonuses and power comparisons.',
			badge: 'Combat',
			color: 'from-red-500/15 to-red-400/5 dark:from-red-900/40 dark:to-red-950/20',
			border: 'border-red-300 dark:border-red-800/30',
			badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
		},
		{
			icon: getIcon('chart'),
			title: 'Resource Tracker',
			available: 'Not Available',
			description: 'Monitor production rates, consumption, and optimize your economy in real time.',
			badge: 'Economy',
			color: 'from-emerald-500/15 to-emerald-400/5 dark:from-emerald-900/40 dark:to-emerald-950/20',
			border: 'border-emerald-300 dark:border-emerald-800/30',
			badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
		},
		{
			icon: getIcon('map'),
			title: 'Territory Planner',
			available: 'Not Available',
			description:
				'Visualize your empire, plan expansions and track resource nodes across the map.',
			badge: 'Strategy',
			color: '',
			border: '',
			badgeColor: ''
		}
	];

	const stats = [
		{ label: 'Active Tools', value: '3', suffix: '' },
		{ label: 'Battles Simulated', value: '0', suffix: '' },
		{ label: 'Maps Planned', value: '0', suffix: '' },
		{ label: 'Alliance Members', value: '—', suffix: '' }
	];

	const steps = [
		{
			step: '01',
			title: 'Search Your User',
			desc: 'Search your user in the sidebar panel below to link your account.',
			icon: getIcon('search')
		},
		{
			step: '02',
			title: 'Choose a Tool',
			desc: 'Navigate to any tool from the sidebar. Each module connects to your game data.',
			icon: getIcon('navigate')
		},
		{
			step: '03',
			title: 'Dominate',
			desc: 'Use insights from your dashboard to make smarter decisions and outpace your rivals.',
			icon: getIcon('ranking')
		}
	];

	let visible = $state(false);
	let statsVisible = $state(false);

	onMount(() => {
		requestAnimationFrame(() => {
			visible = true;
			setTimeout(() => {
				statsVisible = false;
			}, 400);
		});
	});
</script>

<div class="page-wrapper flex flex-1 flex-col gap-6">
	<!-- Hero Section -->
	<div
		class="hero-bg grid-bg relative overflow-hidden rounded-xl border border-primary/25"
		class:hero-visible={visible}
		style="opacity: 0; min-height: 220px;"
	>
		<!-- Corner decorations -->
		<div
			class="pointer-events-none absolute top-0 left-0 h-8 w-8 rounded-tl-xl border-t-2 border-l-2 border-primary/50"
		></div>
		<div
			class="pointer-events-none absolute top-0 right-0 h-8 w-8 rounded-tr-xl border-t-2 border-r-2 border-primary/50"
		></div>
		<div
			class="pointer-events-none absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-2 border-l-2 border-primary/50"
		></div>
		<div
			class="pointer-events-none absolute right-0 bottom-0 h-8 w-8 rounded-br-xl border-r-2 border-b-2 border-primary/50"
		></div>

		<!-- Scanline effect -->
		<div
			class="scanline pointer-events-none absolute right-0 left-0 h-0.5 bg-linear-to-r from-transparent via-primary/15 to-transparent"
		></div>

		<!-- Decorative background emblem -->
		<div
			class="pointer-events-none absolute top-1/2 right-6 -translate-y-1/2 text-[120px] opacity-[0.04] select-none"
			aria-hidden="true"
		>
			<Icon name="battle" />
		</div>

		<div class="relative z-10 flex flex-col gap-4 p-6 md:p-8">
			<!-- Status bar -->
			<div class="flex items-center gap-2">
				<span class="label-font text-xs tracking-[0.2em] text-primary/70 uppercase"
					>System Status</span
				>
				<span class="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#4ade80]"></span>
				<span class="label-font text-xs tracking-widest text-emerald-400/80 uppercase"
					>Semi-Operational</span
				>
				<span class="label-font ml-auto text-xs tracking-wider text-muted-foreground">v0.0.1</span>
			</div>

			<!-- Main title -->
			<div>
				<h1
					class="title-font primary-glow glitch text-4xl leading-tight font-bold tracking-wide text-foreground md:text-5xl"
					data-text="War Era"
				>
					War Era <span class="glitch text-primary" data-text="HQ">HQ</span>
				</h1>
				<div class="divider-line mt-2 mb-3 flex items-center gap-3">
					<span class="label-font text-xs tracking-[0.3em] text-primary/60 uppercase"
						>Command Dashboard</span
					>
				</div>
				<p class="max-w-xl text-sm leading-relaxed font-light text-muted-foreground md:text-base">
					Your unified command center for WarEra. Plan strategies, calculate battles, track
					resources — all the tools your empire needs, in one place.
				</p>
			</div>

			<!-- CTA hint -->
			<div class="mt-1 flex items-center gap-2">
				<div class="h-2 w-2 rotate-45 rounded-sm bg-primary/70"></div>
				<span class="label-font text-xs tracking-wide text-muted-foreground">
					Enter your <span class="text-primary/80">User ID</span> in the sidebar to get started
					<span class="cursor-blink ml-0.5 text-primary">_</span>
				</span>
			</div>
		</div>
	</div>

	<!-- Stats Row -->
	{#if statsVisible}
		<div class="stats-delay grid grid-cols-2 gap-3 fade-in md:grid-cols-4">
			{#each stats as stat, i}
				<div
					class="stat-card pulse-anim flex flex-col gap-1 rounded-lg border border-border bg-card px-4 py-3"
					style="animation-delay: {i * 0.08}s"
				>
					<span class="label-font text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
						>{stat.label}</span
					>
					<span class="title-font text-2xl font-semibold text-primary/90"
						>{stat.value}{stat.suffix}</span
					>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Tool Cards -->
	<!-- {#if visible}
		<div class="grid gap-4 md:grid-cols-3">
			{#each tools as tool, i}
				<div
					class="tool-card card-delay-{i +
						1} flex flex-col gap-3 rounded-xl border bg-card bg-gradient-to-br p-5 fade-in {tool.color} {tool.border}"
				>
					Card header
					<div class="flex items-start justify-between gap-2">
						{@render toolIcon(tool.icon)}
						<span
							class="label-font rounded px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase {tool.badgeColor}"
						>
							{tool.badge}
						</span>
					</div>

					Card body
					<div class="flex flex-col gap-1.5">
						<h3 class="label-font text-base font-semibold tracking-wide text-card-foreground">
							{tool.title}
						</h3>
						<p class="text-xs leading-relaxed font-light text-muted-foreground">
							{tool.description}
						</p>
					</div>

					Card footer
					<div class="mt-auto flex items-center gap-1.5 border-t border-border/50 pt-2">
						<span class="h-1.5 w-1.5 rounded-full bg-primary/50"></span>
						<span class="label-font text-[10px] tracking-widest text-muted-foreground uppercase"
							>{tool.available}</span
						>
						<span class="label-font ml-auto text-[10px] tracking-wider text-muted-foreground/60"
							>→ Open</span
						>
					</div>
				</div>
			{/each}
		</div>
	{/if} -->

	<!-- Getting Started Panel -->
	{#if visible}
		<div class="card-delay-3 overflow-hidden rounded-xl border border-border bg-card fade-in">
			<div class="flex items-center gap-3 border-b border-border px-5 py-4">
				<div class="h-4 w-1 rounded-full bg-primary"></div>
				<span
					class="label-font text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase"
					>Getting Started</span
				>
			</div>
			<div class="grid gap-3 p-5 md:grid-cols-3">
				{#each steps as item}
					<div class="flex items-start gap-3">
						<div
							class="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-primary/40 bg-primary/10"
						>
							<span class="label-font text-[10px] font-bold tracking-wider text-primary"
								>{item.step}</span
							>
						</div>
						<div class="flex flex-col gap-0.5">
							<span
								class="label-font flex items-center gap-1.5 text-sm font-semibold tracking-wide text-card-foreground"
							>
								<item.icon />
								{item.title}
							</span>
							<p class="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.page-wrapper {
		background: transparent;
		min-height: 100%;
	}

	.hero-bg {
		background: linear-gradient(
			to bottom right,
			var(--background),
			var(--card),
			color-mix(in oklch, var(--primary) 12%, var(--background))
		);
	}

	.grid-bg {
		background-image:
			linear-gradient(color-mix(in oklch, var(--primary) 6%, transparent) 1px, transparent 1px),
			linear-gradient(
				90deg,
				color-mix(in oklch, var(--primary) 6%, transparent) 1px,
				transparent 1px
			);
		background-size: 40px 40px;
	}

	@keyframes scanline {
		0% {
			transform: translateY(-100%);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			transform: translateY(600%);
			opacity: 0;
		}
	}
	.scanline {
		animation: scanline 6s ease-in-out infinite;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes pulse-border {
		0%,
		100% {
			border-color: color-mix(in oklch, var(--primary) 30%, transparent);
		}
		50% {
			border-color: color-mix(in oklch, var(--primary) 70%, transparent);
		}
	}

	.hero-visible {
		animation: fadeUp 0.7s ease forwards;
	}
	.fade-in {
		animation: fadeIn 0.6s ease forwards;
	}

	.card-delay-1 {
		animation-delay: 0.15s;
		opacity: 0;
	}
	.card-delay-2 {
		animation-delay: 0.3s;
		opacity: 0;
	}
	.card-delay-3 {
		animation-delay: 0.45s;
		opacity: 0;
	}
	.stats-delay {
		animation-delay: 0.1s;
		opacity: 0;
	}

	.tool-card {
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		cursor: pointer;
	}
	.tool-card:hover {
		transform: translateY(-3px);
		box-shadow:
			0 12px 40px color-mix(in oklch, var(--background) 50%, transparent),
			0 0 20px color-mix(in oklch, var(--primary) 10%, transparent);
	}

	.primary-glow {
		text-shadow: 0 0 30px color-mix(in oklch, var(--primary) 35%, transparent);
	}

	.divider-line::before,
	.divider-line::after {
		content: '';
		flex: 1;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in oklch, var(--primary) 40%, transparent),
			transparent
		);
	}

	.pulse-anim {
		animation: pulse-border 2.5s ease-in-out infinite;
	}

	.stat-card {
		transition: background 0.2s ease;
	}
	.stat-card:hover {
		background: color-mix(in oklch, var(--primary) 8%, var(--card));
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}
	.cursor-blink {
		animation: blink 1.1s step-end infinite;
	}
</style>
