<script lang="ts">
	import { Character, Relic } from '../models/Relic';
	import '@fortawesome/fontawesome-free/css/all.css';

	export let characters: Character[];
	export let characterIndex: number = 0;
	export let relicIndex: number = 0;

	$: character = characters[characterIndex];
	$: relic = character.relics[relicIndex];

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
		characters[characterIndex] = character;
	};

	const decreaseRoll = (substatIndex: number) => {
		if (relic.substats[substatIndex].rolls <= 0) {
			relic.substats[substatIndex].rolls = 0;
		} else {
			relic.substats[substatIndex].rolls -= 1;
		}
		characters[characterIndex] = character;
	};
</script>

<div class="flex w-full">
	{#if relic}
		<div class="bg-slate-800 rounded-lg shadow-lg p-6 w-full flex flex-col items-center">
			<!-- HEADER  -->
			<button class="w-full transition-transform duration-300 ease-in-out transform hover:scale-105 hover:bg-slate-600 bg-slate-700">
				<div class="w-full flex flex-row items-center justify-center">
					<img
						src="https://www.prydwen.gg/static/ead9470f7f552c4c7831ca1cea95cda4/d8057/set_9.webp"
						alt="default"
						class="w-24 h-24 object-cover mr-4 flex-initial"
					/>
					<div class="flex flex-col justify-center">
						<h2 class="text-md font-bold mb-2 mr-4 text-white">{relic.name}</h2>
						<h2 class="text-md font-bold mb-2 text-white">LV {relic.level}</h2>
					</div>
				</div>
			</button>

			<!-- SEPARATOR -->
			<div class="w-full h-0.5 flex bg-white my-5"></div>

			<!-- CONTENT -->
			<div class="w-full flex flex-col items-center p-0 m-0">
				{#each relic.substats as substat, substatIndex}
					<div class="w-full flex flex-row justify-between">
						<div class="text-md font-bold mb-2 mr-4 text-white">{substat.name}</div>
						<div class="flex flex-row items-center">
							<div>
								<button
									class="rounded-md mb-2 mr-2 text-white"
									on:click={() => decreaseRoll(substatIndex)}
								>
									<i class="fas fa-minus-circle"></i>
								</button>
							</div>
							<div class="text-md font-bold mb-2 text-white">{substat.rolls}</div>
							<div>
								<button
									class="rounded-md font-bold mb-2 ml-2"
									on:click={() => increaseRoll(substatIndex)}
								>
									<i class="fas fa-plus-circle text-white"></i>
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
	<slot></slot>
</div>
