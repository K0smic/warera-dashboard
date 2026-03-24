<script lang="ts">
	import * as InputGroup from '$lib/components/atoms/input-group/index';
	import * as Avatar from '$lib/components/atoms/avatar/index';
	import * as Sidebar from '$lib/components/atoms/sidebar/index';
	import * as Collapsible from '$lib/components/atoms/collapsible/index';
	import * as Card from '$lib/components/atoms/card/index';
	import { userState } from '$lib/stores/user.svelte';
	import { companiesState } from '$lib/stores/companies.svelte';
	import Button from '$lib/components/atoms/button/button.svelte';
	import Icon from '$lib/components/atoms/Icon/icon.svelte';

	let userId = $state('');
	let isOpen = $state(false);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem class="">
		<Collapsible.Root bind:open={isOpen}>
			<Collapsible.Content>
				<Card.Root class="">
					<Card.Header>
						<Card.Title>Enter your account ID</Card.Title>
						<Card.Description>Enter your account ID below to get your stats.</Card.Description>
					</Card.Header>
					<Card.CardContent class="flex w-full content-center justify-between">
						<InputGroup.Root>
							<InputGroup.Input placeholder="Your account ID" bind:value={userId} />
							<InputGroup.Addon align="inline-end">
								<Icon name="search" />
							</InputGroup.Addon>
						</InputGroup.Root>
					</Card.CardContent>
					<Card.Footer>
						<Button
							class="w-full"
							onclick={() => {
								userState.loadUser(userId);
								companiesState.fetchCompanies(userId);
								isOpen = false;
							}}>Login</Button
						>
					</Card.Footer>
				</Card.Root>
			</Collapsible.Content>
		</Collapsible.Root>

		<Sidebar.MenuButton
			onclick={() => !userState.user && (isOpen = !isOpen)}
			size="lg"
			class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
		>
			<Avatar.Root class="size-8 rounded-lg">
				<Avatar.Image
					loading="lazy"
					src={userState.user ? userState.user.avatarUrl : ''}
					alt={userState.user ? userState.user.username : ''}
				/>
				<Avatar.Fallback class="rounded-lg"
					><Icon name="user-search" class="size-6" /></Avatar.Fallback
				>
			</Avatar.Root>
			<div class="grid flex-1 text-start text-sm leading-tight">
				<span class="truncate font-medium"
					>{userState.user ? userState.user.username : 'Welcome'}</span
				>
				<span class="truncate text-xs">{userState.user ? '' : 'Search your username'}</span>
			</div>
		</Sidebar.MenuButton>
		{#if userState.user}
			<Sidebar.MenuAction
				class="size-7"
				title="Logout"
				style="color: var(--destructive)"
				onclick={() => userState.reset()}
			>
				<Icon name="logout" />
				<span class="sr-only">Logout</span>
			</Sidebar.MenuAction>
		{/if}
	</Sidebar.MenuItem>
</Sidebar.Menu>
