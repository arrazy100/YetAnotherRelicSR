<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.css';
	import { characterIndex, characters, currentCharacter, updateRelic } from '../stores/store';
	import { get_relic_list, get_relic_splash } from '../utils/relic_util';
	import {
		BodyOption,
		BootsOption,
		PlanarOption,
		RopeOption,
		SubstatOption,
		get_by_value
	} from '../constants/constant';
	import placeholder from '../assets/placeholder.png';

	// props
	export let relicIndex: number;

	// variables
	const relicDB = get_relic_list();
    $: relic = $currentCharacter.relics[relicIndex];
	$: relicSplash = relic ? get_relic_splash(relic.id, relicIndex) : '';

	// reactivity
	$: {
		if (relic) {
			characters.update(chars => {
				chars[$characterIndex].relics[relicIndex] = relic;
				return chars;
			});
		}
	}

	// methods
	const updateRelicSplash = () => {
		relicSplash = get_relic_splash(relic.id, relicIndex);
	};

	const handleErrorRelicSplash = () => {
		relicSplash = placeholder;
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
	};

	const decreaseRoll = (substatIndex: number) => {
		let rolls = relic.substats[substatIndex].rolls - 1;
		if (rolls < 0) return;

		relic.substats[substatIndex].rolls -= 1;
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

	const handleRelicOptionChange = () => {
		updateRelicSplash();
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
	};
</script>

{#if relic}
	<div class="flex w-full">
		<div class="bg-slate-700 rounded-lg shadow-lg p-6 w-full flex flex-col items-center">
			<!-- HEADER  -->
			<div class="w-full flex flex-col xl:flex-row items-center justify-center">
				<div class="w-full flex xl:mr-4 mb-4 xl:mb-0 items-center justify-center">
					<img
						src={relicSplash}
						alt="relic_{relicIndex}"
						class="w-24 h-24 object-cover"
						on:error={() => handleErrorRelicSplash()}
					/>
				</div>
				<div class="flex flex-col justify-center">
					<select
						class="block w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						bind:value={relic.id}
						on:change={() => handleRelicOptionChange()}
					>
						{#if relicIndex <= 3}
							{#each relicDB as relicOption}
								{#if relicOption.id < 300}
									<option value={relicOption.id}>{relicOption.name}</option>
								{/if}
							{/each}
						{:else}
							{#each relicDB as relicOption}
								{#if relicOption.id > 300}
									<option value={relicOption.id}>{relicOption.name}</option>
								{/if}
							{/each}
						{/if}
					</select>
					<select
						class="block w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						bind:value={relic.level}
					>
						{#each { length: 15 } as _, i}
							<option value={i + 1}>LV {i + 1}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="w-full flex">
				<select
					class="block w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					bind:value={relic.mainstat_id}
					on:change={(e) => handleMainstatChange(relicIndex)}
				>
					{#each Object.entries(getMainstatOption(relicIndex)) as [key, value]}
						<option {value}>{key.toUpperCase()}</option>
					{/each}
				</select>
			</div>

			<!-- SEPARATOR -->
			<div class="w-full h-0.5 flex bg-white my-5"></div>

			<!-- CONTENT -->
			<div class="w-full flex flex-col items-center p-0 m-0">
				{#each relic.substats as substat, substatIndex}
					<div class="w-full flex flex-row justify-between items-center">
						<div class="relative w-full">
							<select
								class="w-full mt-1 py-2 px-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
								<i class="fas fa-minus-circle"></i>
							</button>
							<div class="text-md font-bold text-white mx-2">
								{substat.rolls}
							</div>
							<button
								type="button"
								class="rounded-md text-white text-2xl"
								on:click={() => increaseRoll(substatIndex)}
							>
								<i class="fas fa-plus-circle"></i>
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<slot></slot>
	</div>
{/if}
