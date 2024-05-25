<script lang="ts">
	import { get_character_splash } from '../utils/relic_util';
	import CharacterSelectCard from './CharacterSelectCard.svelte';
	import RelicCard from './RelicCard.svelte';
	import placeholder from '../assets/placeholder.png';
	import { characters } from '../stores/store';
	import type { Character } from '../models/relic_data';

	// props
	export let characterIndex: number;

	// variables
	let characterPopUpShow = false;
	let character: Character;
	let characterSplash: string;

	// reactivity
	$: {
		character = $characters[characterIndex];
		characterSplash = character ? get_character_splash(character.id) : placeholder;
	}

	// methods
	const handleErrorCharacterSplash = () => {
		characterSplash = placeholder;
	};
</script>

{#if character}
	<div class="h-screen overflow-y-auto">
		<CharacterSelectCard bind:show={characterPopUpShow} {characterIndex} />

		<div
			class="flex flex-col bg-slate-800 md:mx-30 lg:mx-40 p-10 rounded-lg items-center justify-center"
		>
			<div class="flex w-full flex-col justify-center items-center mb-10">
				<div class="text-white text-2xl mb-5 font-bold">{character.name}</div>
				<button
					class="max-w-[50vw] flex justify-center items-center rounded-lg shadow-lg {character.rank ===
					5
						? 'bg-yellow-700'
						: 'bg-purple-700'} opacity-100"
					type="button"
					on:click|stopPropagation={() => (characterPopUpShow = !characterPopUpShow)}
				>
					<img
						class="object-cover"
						src={characterSplash}
						alt={character.name}
						on:error={handleErrorCharacterSplash}
					/>
				</button>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
				{#each character.relics as _, relicIndex}
					<RelicCard {characterIndex} {relicIndex} />
				{/each}
			</div>
		</div>

		<slot></slot>
	</div>
{/if}

<style lang="postcss">
	::-webkit-scrollbar {
		@apply w-3;
	}

	::-webkit-scrollbar-track {
		background: transparent;
	}

	::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.5);
		border-radius: 10px;
		border: 2px solid transparent;
		background-clip: padding-box;
	}

	::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.8);
	}
</style>
