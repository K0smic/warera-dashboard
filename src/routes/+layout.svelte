<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  import * as Sidebar from "$lib/components/atoms/sidebar/index.js";
  import AppSidebar from "$lib/components/organisms/sidebar.svelte";

  export const prerender = true;

  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Sidebar.Provider>
  <AppSidebar />
  <main>
    {@render children?.()}
  </main>
</Sidebar.Provider>
