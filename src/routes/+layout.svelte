<style lang="postcss">
	:global(body) {
		@apply bg-slate-950;
	}
</style>

<script>
	import '../app.css';
	import ExpandedMenu from '../components/ExpandedMenu.svelte';
	import ToolMenu from '../components/ToolMenu.svelte';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	// variables
	let menuOpen = false;
	let toolOpen = false;
</script>

<nav class="sticky top-0 flex w-full flex-row rounded bg-slate-900 p-3">
	<button
		class="toggle-btn z-10 bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 active:bg-slate-700"
		style="visibility: {menuOpen ? 'hidden' : 'visible'}"
		on:click={() => (menuOpen = !menuOpen)}
	>
		<span class="fas fa-bars"></span>
	</button>

	<button
		class="toggle-btn z-10 ml-auto bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 active:bg-slate-700"
		style="visibility: {toolOpen ? 'hidden' : 'visible'}"
		on:click={() => (toolOpen = !toolOpen)}
	>
		<span class="fas fa-wrench"></span>
	</button>
</nav>

<ExpandedMenu bind:menuOpen />

<ToolMenu bind:toolOpen />

<slot />
