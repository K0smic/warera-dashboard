# WIP

### Naming convention
#### Branch Naming Convention WIP

This project uses a structured branch naming system to keep the repository clean and readable.

---

##### Main Branches

| Branch | Purpose |
|--------|---------|
| `main` | Primary source code (development) |
| `gh-pages` | Static build automatically deployed by GitHub Pages |

> GitHub Pages can publish from `main`, from `gh-pages`, or from the `/docs` folder on `main`. The most common pattern with Svelte/Vite is to keep the source on `main` and the build on `gh-pages`, managed via CI (e.g. `peaceiris/actions-gh-pages`).

---

##### Development Branches

Use a **prefix** describing the **type of work**, followed by a short identifier in `kebab-case`:

```
feat/feature-name        → new features
fix/bug-description      → bug fixes
chore/task-description   → maintenance, config, dependencies
refactor/component-name  → refactoring without new features
style/component-name     → CSS/UI-only changes
docs/section-name        → documentation updates
perf/target-name         → performance improvements
```

**Concrete examples:**
```
feat/hero-section
feat/dark-mode-toggle
fix/mobile-nav-overflow
chore/update-svelte5-rc
refactor/store-management
style/typography-system
```

---

##### General Rules

- Always use **lowercase**
- Use **hyphens** (`-`) as separators — no underscores or spaces
- Keep names **short but descriptive** (3–4 words max)
- Avoid special characters, multiple slashes, or dots
- If using an issue tracker, optionally prefix with the issue number: `feat/42-contact-form`

---

##### Recommended Flow

```
feat/new-section
      ↓ PR
    main  ──→  CI build  ──→  gh-pages  (artifact only — do not edit manually)
```