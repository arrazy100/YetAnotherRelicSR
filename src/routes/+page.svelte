<script lang="ts">
	import CharacterCard from '../components/CharacterCard.svelte';
	import ExpandedMenu from '../components/ExpandedMenu.svelte';

	// variables
	let menuOpen = false;
</script>

<main class="h-screen flex">
	<div class="bg-slate-950 w-full h-full relative flex">
		<ExpandedMenu bind:menuOpen />
		<CharacterCard />
	</div>
</main>
