<script lang="ts">
	import RelicCard from '../components/RelicCard.svelte';
	import { Character, Relic, Substat } from '../models/Relic';

	let characters: Character[] = [];

	const addCharacter = (name: string) => {
		if (name === "") {
			return;
		}

		let relics = Array.from({ length: 6 }, () => {
			let substats = Array.from({ length: 4 }, () => new Substat('Crit Rate', 1));
			return new Relic('Longevous Disciple', 1, 15, 'HP', substats);
		});

		let character = new Character(name, relics);
		characters = [...characters, character];
	};

	let characterIndex: number | null = null;
	let characterName: string = '';

	const changeCharacter = (index: number) => {
		characterIndex = index;
	};
</script>

<main>
	<div class="bg-slate-950 w-full h-screen grid grid-cols-3">
		<div class="col-span-1 overflow-y-auto w-full">
			<div class="w-full flex flex-col h-screen items-center p-10">
				<div class="text-white mb-10 text-2xl font-bold">ACHERON RELIC SETUP</div>

				<div class="w-full">
					{#each characters as character, index}
						<div class="my-2">
							<button
								on:click={() => changeCharacter(index)}
								class="block w-full mt-1 py-2 px-3 border text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							>
								{character.name}
							</button>
						</div>
					{/each}
				</div>

				<div class="w-full">
					<div class="mb-2">
						<select
							bind:value={characterName}
							class="block w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						>
							<option value="Acheron"> Acheron </option>
							<option value="Blade"> Blade </option>
							<option value="Jingliu"> Jingliu </option>
						</select>
					</div>
					<div class="mb-2">
						<button
							class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							on:click={() => addCharacter(characterName)}>Add Character</button
						>
					</div>
					<div class="mb-10">
						<button
							class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							>Output Data</button
						>
					</div>
				</div>
			</div>
		</div>
		<!-- Character Data -->
		<div class="bg-slate-900 shadow-lg col-span-2 overflow-y-auto p-10">
			{#if characterIndex != null}
				<div class="flex flex-col">
					<div class="flex w-full flex-col justify-center items-center mb-10">
						<div class="text-white text-2xl mb-5 font-bold">{characters[characterIndex].name}</div>
						<img
							class="w-1/3 h-auto object-cover rounded-lg shadow-lg bg-yellow-700 opacity-100"
							src="https://www.prydwen.gg/static/958329d59d77eb7605e4d01cee5122f0/b26e2/acheron_card.webp"
							alt="Acheron"
						/>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each characters[characterIndex].relics as _, relicIndex}
							<RelicCard bind:characters {characterIndex} {relicIndex} />
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	/* Add styling here */
</style>
