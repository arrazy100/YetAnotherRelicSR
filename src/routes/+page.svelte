<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import RelicCard from '../components/RelicCard.svelte';
	import { Character, Relic, Substat } from '../models/relic_data';
	import {
		get_character_list,
		get_character_name_by_id,
		get_character_splash
	} from '../utils/util';
	import { characters } from '../stores/store';
	import { get, writable } from 'svelte/store';

	let characterDB = get_character_list();

	const addCharacter = (id: number) => {
		if (id === 0) {
			return;
		}

		let existing = $characters.filter((c) => c.id == id).length > 0;
		if (existing) {
			return;
		}

		let name = get_character_name_by_id(id);

		let relics = Array.from({ length: 6 }, () => {
			let substats = Array.from({ length: 4 }, () => new Substat(0, '', 0));
			return new Relic(0, 0, 0, '', substats);
		});

		let character = new Character(id, name, relics);
		$characters = [...$characters, character];
	};

	export const characterIndex = writable(0);
    $: currentCharacter = $characterIndex !== null ? get(characters)[get(characterIndex)] : null;

	let characterId: number = characterDB[0].id;
	let characterSplash = get_character_splash(characterId);

	const changeCharacter = (index: number) => {
		$characterIndex = index;
		characterSplash = get_character_splash($characters[$characterIndex].id);
		menuOpen = false;
	};

	let fileInput: any;

	async function handleFileInput(e: any) {
		const file = e.target.files[0];
		if (!file) return;

		try {
			const fileContents: any = await readFile(file);
			$characters = JSON.parse(fileContents);
		} catch (error) {
			console.error('Error parsing JSON:', error);
		}
	}

	function readFile(file: any) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsText(file);
		});
	}

	const exportData = () => {
		const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify($characters))}`;
		const link = document.createElement('a');
		link.href = jsonString;
		link.download = 'data.json';

		link.click();
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

	let menuOpen = false;

	function handleClickOutside(event: any) {
		const menu = document.querySelector('.menu');
		const toggleBtn = document.querySelector('.toggle-btn');
		if (menu && toggleBtn && !menu.contains(event.target) && !toggleBtn.contains(event.target)) {
			menuOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
	});
</script>

<main class="h-screen flex">
	<input type="file" class="hidden" bind:this={fileInput} on:change={(e) => handleFileInput(e)} />
	<div class="bg-slate-950 w-full h-full relative flex">
		<!-- MENU SECTION -->
		<div
			class="menu z-10 h-full bg-slate-900 transition-transform transform {menuOpen
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
								on:click={() => exportData()}
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
		</div>
		<!-- END OF MENU SECTION -->

		<!-- CHARACTER DATA SECTION -->
		<div class="bg-slate-950 shadow-lg overflow-y-auto overflow-x-auto w-full h-full relative">
			<!-- EXPAND MENU BUTTON SECTION -->
			<button
				class="toggle-btn absolute top-4 left-4 px-4 py-2 bg-slate-950 text-white font-bold rounded-lg shadow-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
				style="visibility: {menuOpen ? 'hidden' : 'visible'}"
				on:click={() => (menuOpen = !menuOpen)}
			>
				<i class="fas fa-angles-right"></i>
			</button>
			<!-- END OF EXPAND MENU BUTTON SECTION -->

			{#if currentCharacter && $characterIndex !== null}
				<div
					class="flex flex-col bg-slate-800 mx-10 sm:mx-20 md:mx-30 lg:mx-40 my-10 p-10 rounded-lg items-center justify-center"
				>
					<div class="flex w-full flex-col justify-center items-center mb-10">
						<div class="text-white text-2xl mb-5 font-bold">{currentCharacter.name}</div>
						<img
							class="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-lg bg-yellow-700 opacity-100"
							src={characterSplash}
							alt={currentCharacter.name}
						/>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each currentCharacter.relics as _, relicIndex}
							<RelicCard characterIndex={$characterIndex} {relicIndex} />
						{/each}
					</div>
				</div>
			{/if}
		</div>
		<!-- END OF CHARACTER DATA SECTION -->
	</div>
</main>

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
