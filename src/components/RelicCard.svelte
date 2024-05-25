<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.css';
	import { get_relic_splash } from '../utils/relic_util';
	import {
		BodyOption,
		BootsOption,
		PlanarOption,
		RopeOption,
		SubstatOption,
		get_by_value
	} from '../constants/constant';
	import placeholder from '../assets/placeholder.png';
	import { characters } from '../stores/store';
	import type { Relic } from '../models/relic_data';
	import RelicSelectCard from './RelicSelectCard.svelte';

	// props
	export let characterIndex: number;
	export let relicIndex: number;

	// variables
	let relic: Relic;
	let relicSplash: string;
	let relicPopUpShow = false;

	// reactivity
	$: {
		const character = $characters[characterIndex];
		if (character && character.relics && character.relics[relicIndex]) {
			relic = character.relics[relicIndex];
			relicSplash = get_relic_splash(relic.id, relicIndex);
		} else {
			relicSplash = placeholder;
		}
	}

	const updateCharacterStore = () => {
		characters.update((chars) => {
			chars[characterIndex].relics[relicIndex] = relic;
			return chars;
		});
	};

	// methods
	const handleErrorRelicSplash = () => {
		relicSplash = placeholder;
	};

	const getMainstatOption = (relicIndex: number) => {
		if (relicIndex === 0) {
			return { hp: 1 };
		} else if (relicIndex === 1) {
			return { atk: 1 };
		} else if (relicIndex === 2) {
			return BodyOption;
		} else if (relicIndex === 3) {
			return BootsOption;
		} else if (relicIndex === 4) {
			return PlanarOption;
		}
		return RopeOption;
	};

	const handleMainstatChange = (event: any) => {
		let mainstatId = relic.mainstat_id;
		let mainstatName = '';

		if (relicIndex === 0) {
			mainstatName = 'hp';
		} else if (relicIndex === 1) {
			mainstatName = 'atk';
		} else if (relicIndex === 2) {
			mainstatName = get_by_value(BodyOption, mainstatId);
		} else if (relicIndex === 3) {
			mainstatName = get_by_value(BootsOption, mainstatId);
		} else if (relicIndex === 4) {
			mainstatName = get_by_value(PlanarOption, mainstatId);
		} else {
			mainstatName = get_by_value(RopeOption, mainstatId);
		}

		const existing = relic.substats.some(
			(x) => x.name.toLowerCase() === mainstatName.toLowerCase()
		);
		if (existing) {
			event.target.value = 0;
			mainstatId = 0;
			mainstatName = '';
		}

		relic.mainstat_id = mainstatId;
		relic.mainstat_name = mainstatName;

		updateCharacterStore();
	};

	const handleSubstatChange = (event: any, substatIndex: number) => {
		let substatId = relic.substats[substatIndex].id;
		let substatName = get_by_value(SubstatOption, substatId);

		const existing = relic.substats.some(
			(x, index) =>
				index !== substatIndex &&
				(x.name.toLowerCase() === substatName.toLowerCase() ||
					substatName === relic.mainstat_name.toLowerCase())
		);
		if (existing) {
			event.target.value = 0;
			substatId = 0;
			substatName = '';
		}

		relic.substats[substatIndex].id = substatId;
		relic.substats[substatIndex].name = substatName;

		updateCharacterStore();
	};

	const validateTotalRoll = () => {
		let total = 0;
		relic.substats.forEach((substat) => {
			total += substat.rolls;
		});
		return total !== 5;
	};

	const increaseRoll = (substatIndex: number) => {
		if (validateTotalRoll()) {
			relic.substats[substatIndex].rolls += 1;
		}

		updateCharacterStore();
	};

	const decreaseRoll = (substatIndex: number) => {
		let rolls = relic.substats[substatIndex].rolls - 1;
		if (rolls < 0) return;

		relic.substats[substatIndex].rolls -= 1;

		updateCharacterStore();
	};
</script>

{#if relic}
	<RelicSelectCard bind:show={relicPopUpShow} bind:relic {characterIndex} {relicIndex} />

	<div class="bg-slate-700 rounded-lg shadow-lg w-full">
		<!-- HEADER  -->
		<div class="grid grid-cols-2 gap-x-2">
			<!-- Relic Splash -->
			<button
				type="button"
				class="w-full h-full shadow-2xl rounded-lg rounded-bl-none rounded-tr-none"
				on:click|stopPropagation={() => (relicPopUpShow = !relicPopUpShow)}
			>
				<img
					src={relicSplash}
					alt="relic_{relicIndex}"
					class="object-contain w-full aspect-video"
					on:error={() => handleErrorRelicSplash()}
				/>
			</button>

			<div class="p-2 justify-center items-center">
				<!-- Relic Name -->
				<div class="text-white text-xl font-semibold mb-2">{relic.name}</div>

				<!-- Relic Level -->
				<div>
					<select bind:value={relic.level}>
						{#each { length: 15 } as _, i}
							<option value={i + 1}>Lv {i + 1}</option>
						{/each}
					</select>
				</div>

				<!-- Relic Mainstat -->
				<div class="w-full flex">
					<select
						bind:value={relic.mainstat_id}
						on:change={(e) => handleMainstatChange(relicIndex)}
					>
						{#each Object.entries(getMainstatOption(relicIndex)) as [key, value]}
							<option {value}>{key.toUpperCase()}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<!-- SEPARATOR -->
		<div class="w-full h-0.5 flex bg-white mt-5"></div>

		<!-- CONTENT -->
		<div class="w-full flex flex-col items-center p-5">
			{#each relic.substats as substat, substatIndex}
				<div class="w-full flex flex-row justify-between items-center">
					<div class="relative w-full">
						<select
							bind:value={substat.id}
							on:change={(event) => handleSubstatChange(event, substatIndex)}
						>
							{#each Object.entries(SubstatOption) as [key, value]}
								<option {value}>{key.toUpperCase()}</option>
							{/each}
						</select>
					</div>
					<div class="flex flex-row ml-2 items-center justify-center">
						<button
							type="button"
							class="rounded-md text-white text-2xl"
							on:click={() => decreaseRoll(substatIndex)}
						>
							<span class="fas fa-minus-circle"></span>
						</button>
						<div class="text-md font-bold text-white mx-2">
							{substat.rolls}
						</div>
						<button
							type="button"
							class="rounded-md text-white text-2xl"
							on:click={() => increaseRoll(substatIndex)}
						>
							<span class="fas fa-plus-circle"></span>
						</button>
					</div>
				</div>
			{/each}
		</div>

		<slot></slot>
	</div>
{/if}

<style lang="postcss">
	select {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		@apply font-semibold block w-full mt-1 py-2 px-3 border border-gray-300 bg-slate-700 rounded-md shadow-sm focus:outline-none focus:bg-gray-500 focus:border-gray-500 focus:opacity-80 sm:text-sm hover:cursor-pointer text-white;
	}
</style>
