<script lang="ts">
	import { error } from '@sveltejs/kit';
	import CharacterCard from '../../../components/CharacterCard.svelte';
	import { characters } from '../../../stores/store';

	// props
	export let data;

	// store
	$: characterIndex = 0;
	$: {
		let index = $characters.findIndex((c) => c.id === parseInt(data.id));
		if (index === -1) error(404, 'Character id not found');

		characterIndex = index;

		console.log(characterIndex);
	}
</script>


<CharacterCard {characterIndex} />