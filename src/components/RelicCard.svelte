<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.css';
	import { Character } from '../models/relic_data';
	import { get_relic_list, get_relic_splash } from '../utils/util';
	import defaultRelicSplash from '../assets/default_relic_splash.png';
	import { BodyOption, BootsOption, PlanarOption, RopeOption, SubstatOption } from '../constants/constant';

	export let characters: Character[];
	export let characterIndex: number = 0;
	export let relicIndex: number = 0;

	$: character = characters[characterIndex];
	$: relic = character.relics[relicIndex];
	$: relicSplash = get_relic_splash(relic.id, relicIndex);

	const relicDB = get_relic_list();

	const validateTotalRoll = () => {
		let total = 0;
		relic.substats.forEach((substat) => {
			total += substat.rolls;
		});

		if (total == 5) {
			return false;
		}

		return true;
	};

	const increaseRoll = (substatIndex: number) => {
		if (validateTotalRoll()) {
			relic.substats[substatIndex].rolls += 1;
		}
	};

	const decreaseRoll = (substatIndex: number) => {
		if (relic.substats[substatIndex].rolls <= 0) {
			relic.substats[substatIndex].rolls = 0;
		} else {
			relic.substats[substatIndex].rolls -= 1;
		}
	};

	const changeRelic = (relicIndex: number) => {
		relicSplash = get_relic_splash(relic.id, relicIndex);
	};

	const handleRelicSplashError = () => {
		relicSplash = defaultRelicSplash;
	};

	const handleSubstatChange = (substatIndex: number) => {
		const substatId = relic.substats[substatIndex].id;
		const existing = relic.substats.filter((substat) => substat.id === substatId);

		if (existing.length > 1) {
			relic.substats[substatIndex].id = 0;
		}
	};

	const getMainstatOption = (relicIndex: number) => {
		if (relicIndex === 0) {
			return {"hp": 1}
		}
		else if (relicIndex === 1) {
			return {"atk": 1}
		}
		else if (relicIndex === 2) {
			return BodyOption;
		}
		else if (relicIndex === 3) {
			return BootsOption;
		}
		else if (relicIndex === 4) {
			return PlanarOption;
		}
		
		return RopeOption;
	};
</script>

<div class="flex w-full">
	{#if relic}
		<div class="bg-slate-800 rounded-lg shadow-lg p-6 w-full flex flex-col items-center">
			<!-- HEADER  -->
			<div class="w-full flex flex-row items-center justify-center">
				<img
					src={relicSplash}
					alt="relic_{relicIndex}"
					class="w-24 h-24 object-cover mr-4 flex-initial"
					on:error={() => handleRelicSplashError()}
				/>
				<div class="flex flex-col justify-center">
					<select
						class="block w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						bind:value={relic.id}
						on:change={() => changeRelic(relicIndex)}
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
				>
					{#each Object.entries(getMainstatOption(relicIndex)) as [key, value]}
						<option value={value}>{key.toUpperCase()}</option>
					{/each}
				</select>
			</div>

			<!-- SEPARATOR -->
			<div class="w-full h-0.5 flex bg-white my-5"></div>

			<!-- CONTENT -->
			<div class="w-full flex flex-col items-center p-0 m-0">
				{#each relic.substats as _, substatIndex}
					<div class="w-full flex flex-row justify-between items-center">
						<div class="relative w-full">
							<select
								class="w-full mt-1 py-2 px-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								bind:value={relic.substats[substatIndex].id}
								on:change={() => handleSubstatChange(substatIndex)}
							>
								{#each Object.entries(SubstatOption) as [key, value]}
									<option {value}>{key.toUpperCase()}</option>
								{/each}
							</select>
						</div>
						<div class="flex flex-row items-center ml-2">
							<button
								class="rounded-md mr-2 text-white"
								on:click={() => decreaseRoll(substatIndex)}
							>
								<i class="fas fa-minus-circle"></i>
							</button>
							<div class="text-md font-bold text-white">
								{relic.substats[substatIndex].rolls}
							</div>
							<button class="rounded-md ml-2" on:click={() => increaseRoll(substatIndex)}>
								<i class="fas fa-plus-circle text-white"></i>
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
	<slot></slot>
</div>
