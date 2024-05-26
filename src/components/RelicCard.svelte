<style lang="postcss">
	select {
		@apply my-1 block w-full rounded-md border border-gray-300 bg-slate-700 px-3 py-2 text-white hover:cursor-pointer focus:border-blue-500 focus:outline-none;
	}
</style>

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
	import { toTitleCase } from '../utils/util';

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
	<RelicSelectCard
		bind:show={relicPopUpShow}
		bind:relic
		{characterIndex}
		{relicIndex}
	/>

	<div class="w-full rounded-lg bg-slate-700 shadow-lg">
		<!-- HEADER  -->
		<div class="grid grid-cols-2 gap-x-2">
			<!-- Relic Splash -->
			<button
				type="button"
				class="h-full w-full rounded-lg rounded-bl-none rounded-tr-none shadow-2xl"
				on:click|stopPropagation={() => (relicPopUpShow = !relicPopUpShow)}
			>
				<img
					src={relicSplash}
					alt="relic_{relicIndex}"
					class="aspect-video w-full object-contain"
					on:error={() => handleErrorRelicSplash()}
				/>
			</button>

			<div class="items-center justify-center p-2">
				<!-- Relic Name -->
				<div class="mb-2 text-xl font-semibold text-white">{relic.name}</div>

				<!-- Relic Level -->
				<div>
					<select bind:value={relic.level}>
						<option
							value={0}
							disabled
							selected>Select Level</option
						>
						{#each { length: 15 } as _, i}
							<option value={i + 1}>Lv {i + 1}</option>
						{/each}
					</select>
				</div>

				<!-- Relic Mainstat -->
				<div class="flex w-full">
					<select
						bind:value={relic.mainstat_id}
						on:change={(e) => handleMainstatChange(relicIndex)}
					>
						<option
							value={0}
							disabled
							selected>Select Mainstat</option
						>
						{#each Object.entries(getMainstatOption(relicIndex)) as [key, value]}
							<option {value}>{toTitleCase(key)}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<!-- SEPARATOR -->
		<div class="mt-5 flex h-0.5 w-full bg-white"></div>

		<!-- CONTENT -->
		<div class="flex w-full flex-col items-center p-5">
			{#each relic.substats as substat, substatIndex}
				<div class="flex w-full flex-row items-center justify-between">
					<div class="relative w-full">
						<select
							bind:value={substat.id}
							on:change={(event) => handleSubstatChange(event, substatIndex)}
						>
							<option
								value={0}
								disabled
								selected>Select Substat</option
							>
							{#each Object.entries(SubstatOption) as [key, value]}
								<option {value}>{toTitleCase(key)}</option>
							{/each}
						</select>
					</div>
					<div class="ml-2 flex flex-row items-center justify-center">
						<button
							type="button"
							class="rounded-md text-2xl text-white"
							on:click={() => decreaseRoll(substatIndex)}
						>
							<span class="fas fa-minus-circle"></span>
						</button>
						<div class="text-md mx-2 font-bold text-white">
							{substat.rolls}
						</div>
						<button
							type="button"
							class="rounded-md text-2xl text-white"
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
