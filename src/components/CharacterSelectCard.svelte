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

<script lang="ts">
	import { goto } from '$app/navigation';
	import { Character, Relic, Substat } from '../models/relic_data';
	import { characters } from '../stores/store';
	import {
		get_character_by_id,
		get_character_list,
		get_character_splash
	} from '../utils/relic_util';
	import { clickOutside } from '../utils/util';
	import placeholder from '../assets/placeholder.png';

	// props
	export let show = false;
	export let characterIndex: number;

	// variables
	let search = '';

	// reactivity
	$: character_list = get_character_list().filter((x) =>
		x.name.toLowerCase().includes(search.toLowerCase())
	);
	$: currentCharacter = $characters[characterIndex];

	// methods
	const addCharacter = (id: number) => {
		if (id === 0) {
			return;
		}

		let existing = $characters.filter((c) => c.id == id).length > 0;
		if (existing) {
			return;
		}

		let character_db = get_character_by_id(id);

		let relics = Array.from({ length: 6 }, () => {
			let substats = Array.from({ length: 4 }, () => new Substat(0, '', 0));
			return new Relic(0, '', 0, 0, '', substats);
		});

		let character = new Character(id, character_db.name, character_db.rank, relics);
		$characters = [...$characters, character];
	};

	const handleCharacterClick = (id: number) => {
		show = false;
		if (currentCharacter.id === id) return;

		let existing = $characters.some((c) => c.id === id);
		if (!existing) {
			addCharacter(id);
		}

		goto(`/character/${id}`);
	};

	const handleErrorCharacterSplash = (event: any) => {
		event.target.src = placeholder;
	};
</script>

{#if show}
	<div
		class="fixed left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-900 pb-5 shadow-lg md:w-8/12"
		use:clickOutside
		on:click_outside={() => (show = false)}
	>
		<button
			class="fixed right-4 top-4 z-10 bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 active:bg-slate-700"
			type="button"
			on:click={() => {
				show = !show;
			}}
		>
			<span class="fas fa-times"></span>
		</button>

		<div class="px-10 pt-5">
			<div class="mb-10 flex items-center justify-center text-2xl text-white">Character List</div>
			<div class="relative mb-4 flex items-center justify-center">
				<input
					type="text"
					class="block w-full rounded-lg bg-slate-300 px-4 py-2 text-black shadow-lg placeholder:text-slate-700"
					placeholder="Search character..."
					bind:value={search}
				/>
				<button
					type="button"
					class="absolute right-2 text-2xl text-slate-700"
					on:click={() => (search = '')}
				>
					<span class="fas {search.length > 0 ? 'fa-times' : 'fa-magnifying-glass'}"></span>
				</button>
			</div>
		</div>

		<div class="flex max-h-[80%] justify-center overflow-y-auto">
			<div class="grid grid-cols-2 gap-4 px-5 md:grid-cols-2 lg:grid-cols-3">
				{#each character_list as character}
					<button
						type="button"
						class="grid h-full w-full"
						on:click={() => handleCharacterClick(character.id)}
					>
						<img
							src={get_character_splash(character.id)}
							alt="character_{character.id}"
							class="object-cover {character.rank === 5
								? 'bg-orange-500'
								: 'bg-purple-500'} aspect-square w-full rounded-lg"
							on:error={handleErrorCharacterSplash}
						/>
						<div class="w-full text-center text-lg text-white">
							{character.name}
						</div>
					</button>
				{/each}
			</div>
		</div>
		<slot></slot>
	</div>
{/if}
