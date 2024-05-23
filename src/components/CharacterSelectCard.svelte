<script lang="ts">
	import { Character, Relic, Substat } from '../models/relic_data';
	import { characterIndex, characters, currentCharacter } from '../stores/store';
	import {
		get_character_by_id,
		get_character_list,
		get_character_splash
	} from '../utils/relic_util';
	import { clickOutside } from '../utils/util';

	// props
	export let show = false;

	// variables
	let search = '';
	$: character_list = get_character_list().filter(x => x.name.toLowerCase().includes(search.toLowerCase()));

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
			return new Relic(0, 0, 0, '', substats);
		});

		let character = new Character(id, character_db.name, character_db.rank, relics);
		$characters = [...$characters, character];
	};

	const handleCharacterClick = (id: number) => {
		show = false;
		if ($currentCharacter.id === id) return;

		let existing = $characters.some((c) => c.id === id);
		if (!existing) {
			addCharacter(id);
			$characterIndex = $characters.length;
			$currentCharacter = $characters[$characterIndex];
		}

		let pos = $characters.findIndex((c) => c.id === id);
		if (pos !== -1) {
			$characterIndex = pos;
			$currentCharacter = $characters[$characterIndex];
		}
	};
</script>

{#if show}
	<div
		class="w-[80vw] sm:w-[50vw] z-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 shadow-lg rounded-lg"
		use:clickOutside
		on:click_outside={() => (show = false)}
	>
		<div
			class="absolute top-4 right-4 bg-slate-950 text-white font-bold rounded-lg shadow-md hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
		>
			<button
				type="button"
				on:click={() => {
					show = !show;
				}}
			>
				<span class="fas fa-times text-2xl"></span>
			</button>
		</div>

		<div class="my-4 text-2xl flex justify-center items-center text-white">Character List</div>

		<div class="my-4 flex justify-center">
			<input
				type="text"
				class="rounded-lg px-1 py-2 bg-slate-950 shadow-lg border border-s-white text-white"
				bind:value={search}
			/>
		</div>

		<div class="max-h-[50vh] overflow-y-auto">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-10">
				{#each character_list as character}
					<button
						type="button"
						class="w-full h-full flex flex-col justify-center items-center"
						on:click={() => handleCharacterClick(character.id)}
					>
						<div
							class="{character.rank == 5
								? 'bg-yellow-700'
								: 'bg-purple-700'} rounded-lg w-full h-full justify-center items-center"
						>
							<img
								src={get_character_splash(character.id)}
								alt="char_{character.id}"
								class="object-cover"
							/>
						</div>
						<div class="my-1 text-sm text-white text-center">
							{character.name}
						</div>
					</button>
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
