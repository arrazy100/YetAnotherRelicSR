<script>
	import '../app.css';
	import ExpandedMenu from '../components/ExpandedMenu.svelte';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	// variables
	let menuOpen = false;
</script>

<nav>
	<ExpandedMenu bind:menuOpen />
</nav>
<slot />

<style lang="postcss">
	:global(body) {
		@apply bg-slate-950;
	}
</style>
