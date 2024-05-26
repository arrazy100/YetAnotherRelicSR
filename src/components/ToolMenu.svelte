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
	import { characters } from '../stores/store';
	import { get_character_by_id, get_character_list } from '../utils/relic_util';
	import { Character, Relic, Substat } from '../models/relic_data';
	import { clickOutside, exportData, readFile } from '../utils/util';
	import { goto } from '$app/navigation';

	// props
	export let toolOpen = false;

	// variables
	let characterDB = get_character_list();
	let characterId: number;
	let fileInput: any;

	// methods
	const addCharacter = (id: number) => {
		if (id === 0) {
			return;
		}

		let existing = $characters.find((c) => c.id == id);
		if (existing !== undefined) {
            toolOpen = false;
			goto(`/character/${existing.id}`);
		}

		let character_db = get_character_by_id(id);

		let relics = Array.from({ length: 6 }, () => {
			let substats = Array.from({ length: 4 }, () => new Substat(0, '', 0));
			return new Relic(0, '', 0, 0, '', substats);
		});

		let character = new Character(id, character_db.name, character_db.rank, relics);
		$characters = [...$characters, character];
	};

	const handleFileInput = async (e: any) => {
		const file = e.target.files[0];
		if (!file) return;

		try {
			const fileContents: any = await readFile(file);
			$characters = JSON.parse(fileContents);
		} catch (error) {
			console.error('Error parsing JSON:', error);
		}
	};

	const outputCommand = () => {
		let commandString = '';
		$characters.forEach((character: Character) => {
			character.relics.forEach((relic, index) => {
				if (relic.mainstat_id === 0 || relic.id === 0) return;

				let substats_str = '';
				let substats_length = 0;
				relic.substats.forEach((substat) => {
					if (substat.id === 0) return;

					substats_str += `${substat.id} ${substat.rolls + 1} `;
					substats_length += 1;
				});

				if (relic.level >= 3 && substats_length < 4) return;

				const relicId = 60000 + relic.id * 10 + index + 1;
				const relicCommand = `/relic give ${relicId} ${relic.level} ${relic.mainstat_id} ${substats_length} ${substats_str}`;

				commandString += `${relicCommand}\n`;
			});
		});

		const txtString = `data:text/txt;chatset=utf-8,${encodeURIComponent(commandString)}`;
		const link = document.createElement('a');
		link.href = txtString;
		link.download = 'relics.txt';

		link.click();
	};
</script>

<input
	type="file"
	class="hidden"
	bind:this={fileInput}
	on:change={(e) => handleFileInput(e)}
/>

{#if toolOpen}
	<div
		use:clickOutside
		on:click_outside={() => (toolOpen = false)}
		class="menu z-20 h-full transform bg-slate-900 transition-transform {toolOpen
			? 'translate-x-0'
			: '-translate-x-full'} fixed right-0 top-0 max-h-screen overflow-y-auto"
	>
		<button
			class="absolute right-4 top-4 rounded bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 active:bg-slate-700"
			on:click={() => (toolOpen = false)}
		>
			<span class="fas fa-times"></span>
		</button>
		<div class="mt-10 h-fit w-full p-4">
			<div class="flex w-full flex-col items-center p-4">
				<div class="mt-4 w-full">
					<div class="mb-2">
						<select
							bind:value={characterId}
							class="block w-full rounded bg-slate-700 p-2 text-white placeholder-slate-400 hover:bg-slate-600 focus:ring-2 focus:ring-slate-500"
						>
							{#each characterDB as character}
								<option value={character.id}>{character.name}</option>
							{/each}
						</select>
					</div>
					<div class="mb-2">
						<button
							class="w-full rounded bg-orange-500 p-2 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 active:bg-orange-700"
							on:click={() => addCharacter(characterId)}
						>
							Add Character
						</button>
					</div>
					<div class="mb-2">
						<button
							class="w-full rounded bg-orange-500 p-2 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 active:bg-orange-700"
							on:click={() => fileInput.click()}
						>
							Import Data
						</button>
					</div>
					<div class="mb-2">
						<button
							class="w-full rounded bg-orange-500 p-2 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 active:bg-orange-700"
							on:click={() => exportData($characters)}
						>
							Export Data
						</button>
					</div>
					<div class="mb-10">
						<button
							class="w-full rounded bg-orange-500 p-2 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 active:bg-orange-700"
							on:click={() => outputCommand()}
						>
							Output Command
						</button>
					</div>
				</div>
			</div>
		</div>
		<slot></slot>
	</div>
{/if}
