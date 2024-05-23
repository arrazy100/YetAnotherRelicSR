<script lang="ts">
	import { characterIndex, characters, currentCharacter } from '../stores/store';
	import { get_character_by_id, get_character_list, get_character_name_by_id } from '../utils/relic_util';
	import { Character, Relic, Substat } from '../models/relic_data';
	import { clickOutside, exportData, readFile } from '../utils/util';

	// props
	export let menuOpen = false;

	// variables
	let characterDB = get_character_list();
	let characterId: number;
	let fileInput: any;

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

	const changeCharacter = (index: number) => {
        $currentCharacter = $characters[index];
        $characterIndex = index;
		menuOpen = false;
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
				let substats_str = '';
				relic.substats.forEach((substat) => {
					substats_str += ` ${substat.id} ${substat.rolls + 1}`;
				});

				const relicId = 60000 + relic.id * 10 + index + 1;
				const relicCommand = `/relic give ${relicId} ${relic.level} ${relic.mainstat_id} ${relic.substats.length}${substats_str}`;

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

<input type="file" class="hidden" bind:this={fileInput} on:change={(e) => handleFileInput(e)} />

<!-- EXPAND MENU BUTTON SECTION -->
<button
	class="toggle-btn absolute top-4 left-4 px-4 py-2 bg-slate-950 text-white font-bold rounded-lg shadow-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
	style="visibility: {menuOpen ? 'hidden' : 'visible'}"
	on:click={() => (menuOpen = !menuOpen)}
>
	<i class="fas fa-angles-right"></i>
</button>
<!-- END OF EXPAND MENU BUTTON SECTION -->

{#if menuOpen}
	<div
		use:clickOutside
		on:click_outside={() => (menuOpen = false)}
		class="menu z-20 h-full bg-slate-900 transition-transform transform {menuOpen
			? 'translate-x-0'
			: '-translate-x-full'} max-h-screen overflow-y-auto absolute top-0 left-0"
	>
		<button
			class="absolute top-4 right-4 px-4 py-2 bg-slate-900 text-white font-bold rounded-lg shadow-md hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
			on:click={() => (menuOpen = false)}
		>
			<i class="fas fa-times"></i>
		</button>
		<div class="w-full h-fit p-4 mt-10">
			<div class="w-full flex flex-col items-center p-4">
				<div class="text-white mb-4 text-2xl font-bold text-center">YET ANOTHER RELIC SETUP</div>
				<div class="w-full">
					{#each $characters as character, index}
						<div class="my-2">
							<button
								on:click={() => changeCharacter(index)}
								class="block w-full py-2 px-3 border text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							>
								{character.name}
							</button>
						</div>
					{/each}
				</div>
				<div class="w-full mt-4">
					<div class="mb-2">
						<select
							bind:value={characterId}
							class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						>
							{#each characterDB as character}
								<option value={character.id}>{character.name}</option>
							{/each}
						</select>
					</div>
					<div class="mb-2">
						<button
							class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							on:click={() => addCharacter(characterId)}
						>
							Add Character
						</button>
					</div>
					<div class="mb-2">
						<button
							class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							on:click={() => fileInput.click()}
						>
							Import Data
						</button>
					</div>
					<div class="mb-2">
						<button
							class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							on:click={() => exportData($characters)}
						>
							Export Data
						</button>
					</div>
					<div class="mb-10">
						<button
							class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
