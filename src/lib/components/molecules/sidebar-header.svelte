<script lang="ts">
	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import logo from '$lib/assets/logo.png';

	import { toggleMode } from 'mode-watcher';
	import IconWorld from 'virtual:icons/mdi/world';
	import MdiWhiteBalanceSunny from '~icons/mdi/white-balance-sunny';
	import MdiMoonAndStars from '~icons/mdi/moon-and-stars';
	import { resolve } from '$app/paths';
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<a href={resolve('/')}>
			<Sidebar.MenuButton
				size="lg"
				class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				tabindex={-1}
			>
				<div
					class="flex aspect-square max-w-1/5 items-center justify-center rounded-lg text-sidebar-primary-foreground"
				>
					<img src={logo} alt="Logo" class="aspect-square rounded-xl bg-muted" loading="lazy" />
				</div>
				<div class="grid flex-1 text-start text-sm leading-tight">
					<h1 class="truncate font-medium">War Era</h1>
					<span class="truncate text-xs">Dashboard</span>
				</div>
			</Sidebar.MenuButton>
		</a>
		<Sidebar.MenuAction onclick={toggleMode} class="size-7" title="Toggle light/dark theme">
			<MdiWhiteBalanceSunny
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
			/>
			<MdiMoonAndStars
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Sidebar.MenuAction>
	</Sidebar.MenuItem>
</Sidebar.Menu>
