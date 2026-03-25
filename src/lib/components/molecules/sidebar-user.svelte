<script lang="ts">
	import * as InputGroup from '$lib/components/atoms/input-group/index';
	import * as Avatar from '$lib/components/atoms/avatar/index';
	import * as Sidebar from '$lib/components/atoms/sidebar/index';
	import * as Card from '$lib/components/atoms/card/index';
	import * as Dialog from '$lib/components/atoms/dialog/index';
	import * as Command from '$lib/components/atoms/command/index';
	import { userState } from '$lib/stores/user.svelte';
	import { companiesState } from '$lib/stores/companies.svelte';
	import Button from '$lib/components/atoms/button/button.svelte';
	import Icon from '$lib/components/atoms/Icon/icon.svelte';

	import { batchFetch, search } from '$lib/services';
	import type { UserLiteResponse } from '$lib/types/api/schemas';

	let input = $state('');
	let users = $state<UserLiteResponse[]>([]);
	let isOpen = $state(false);
	let isLoading = $state(false);

	const controller = new AbortController();

	async function searchUser(value: string) {
		if (value.length < 3) {
			users = [];
			return;
		}

		isLoading = true;
		try {
			const result = await search({ searchText: value });

			if (!result.userIds.length) {
				users = [];
				return;
			}

			users = await batchFetch(
				result.userIds.map((userId: string) => ({
					path: 'user.getUserLite' as const,
					input: { userId }
				})),
				fetch,
				controller.signal
			);
		} catch (e) {
			console.error(e);
			users = [];
		} finally {
			isLoading = false;
		}
	}

	function selectUser(user: UserLiteResponse) {
		userState.loadUser(user._id);
		companiesState.fetchCompanies(user._id);
		isOpen = false;
		input = '';
		users = [];
	}

	$inspect(users);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<Dialog.Root bind:open={isOpen}>
			<Dialog.Content showCloseButton={false} class="bg-popover p-2">
				<Command.Root>
					<Command.Input
						placeholder="Search your username..."
						bind:value={input}
						oninput={() => searchUser(input)}
					/>
					<Command.List>
						<!-- {#if isLoading}
							<div class="my-5 flex w-full justify-center text-center align-middle">
								<Command.Loading>Searching…</Command.Loading>
							</div>
						{/if} -->

						{#if users.length > 0}
							<Command.Empty>No user found.</Command.Empty>
							<Command.Group heading="Users">
								<div class="pm-4 flex flex-col gap-2">
									{#each users as user (user._id)}
										<Command.Item
											value={user.username}
											onSelect={() => selectUser(user)}
											class="flex grow items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/40"
										>
											<Avatar.Root class="size-9 shrink-0 rounded-lg">
												<Avatar.Image
													src={user.avatarUrl}
													alt={`Avatar of ${user.username}`}
													loading="lazy"
												/>
												<Avatar.Fallback class="rounded-lg text-xs">
													{user.username?.[0]?.toUpperCase() ?? 'U'}
												</Avatar.Fallback>
											</Avatar.Root>

											<div class="flex min-w-0 flex-1 flex-col gap-0.5">
												<span class="truncate text-sm font-semibold">
													{user.username}
												</span>
												<span class="truncate text-xs text-muted-foreground">
													#{user._id}
												</span>
											</div>
										</Command.Item>
									{/each}
								</div>
							</Command.Group>
						{/if}
					</Command.List>
				</Command.Root>
			</Dialog.Content>
		</Dialog.Root>

		<Sidebar.MenuButton
			onclick={() => !userState.user && (isOpen = !isOpen)}
			size="lg"
			class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
		>
			<Avatar.Root class="size-8 rounded-lg">
				<Avatar.Image
					loading="lazy"
					src={userState.user?.avatarUrl ?? ''}
					alt={userState.user?.username ?? ''}
				/>
				<Avatar.Fallback class="rounded-lg">
					<Icon name="user-search" class="size-6" />
				</Avatar.Fallback>
			</Avatar.Root>
			<div class="grid flex-1 text-start text-sm leading-tight">
				<span class="truncate font-medium">
					{userState.user?.username ?? 'Welcome'}
				</span>
				<span class="truncate text-xs">
					{userState.user ? '' : 'Search your username'}
				</span>
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
