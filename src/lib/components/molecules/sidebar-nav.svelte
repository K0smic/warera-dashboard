<script lang="ts">
	import * as Collapsible from '$lib/components/atoms/collapsible/index.js';
	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import type { NavItem } from '$lib/types/common/navigation';

	let { items }: { items: NavItem[] } = $props();
</script>

<Sidebar.Group>
	<Sidebar.Menu>
		{#each items as item (item.title)}
			<Collapsible.Root open={item.isActive} class="group/collapsible">
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<!-- Navigation link: standalone, does NOT trigger collapse -->
						<Sidebar.MenuButton tooltipContent={item.title}>
							{#snippet child({ props })}
								<a href={item.url} {...props}>
									{#if item.icon}
										<item.icon />
									{/if}
									<span>{item.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>

						<!-- Chevron: the ONLY collapse trigger -->
						{#if item.items}
							<Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuAction class="h-6 w-6" {...props}>
										<ChevronRightIcon
											class="size-full transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
										/>
									</Sidebar.MenuAction>
								{/snippet}
							</Collapsible.Trigger>

							<Collapsible.Content>
								<Sidebar.MenuSub>
									{#each item.items as subItem (subItem.id)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton>
												{#snippet child({ props })}
													<a href={subItem.url} {...props}>
														<span>{subItem.title}</span>
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							</Collapsible.Content>
						{/if}
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
