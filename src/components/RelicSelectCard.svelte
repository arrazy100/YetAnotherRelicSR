<script lang="ts">
	import type { RelicDB } from '../models/db';
	import { Relic } from '../models/relic_data';
	import { characters } from '../stores/store';
	import { get_relic_list, get_relic_splash } from '../utils/relic_util';
	import { clickOutside } from '../utils/util';
	import placeholder from '../assets/placeholder.png';

	// props
	export let show = false;
	export let characterIndex: number;
	export let relicIndex: number;
	export let relic: Relic;

	// variables
	let search = '';
	let relic_list: RelicDB[];

	// reactivity
	$: {
		relic_list = get_relic_list().filter((x) =>
			x.name.toLowerCase().includes(search.toLowerCase())
		);
	}

	// methods
	const updateCharacterStore = () => {
		characters.update((chars) => {
			chars[characterIndex].relics[relicIndex] = relic;
			return chars;
		});
	};

	const handleRelicClick = (selectedRelic: RelicDB) => {
		show = false;
		relic.id = selectedRelic.id;
		relic.name = selectedRelic.name;

		updateCharacterStore();
	};

	const handleErrorRelicSplash = (event: any) => {
		event.target.src = placeholder;
	};

	const shouldRenderRelic = (relicOption: RelicDB) => {
		return (relicIndex <= 3 && relicOption.id < 300) || (relicIndex > 3 && relicOption.id > 300);
	};
</script>

{#if show}
	<div
		class="w-full h-full md:w-8/12 z-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 shadow-lg rounded-lg"
		use:clickOutside
		on:click_outside={() => (show = false)}
	>
		<div
			class="fixed top-4 right-4 bg-slate-950 text-white font-bold rounded-lg shadow-md hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
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

		<div class="px-10 pt-5">
			<div class="mb-10 text-2xl flex justify-center items-center text-white">Relic List</div>
			<div class="mb-4 relative flex justify-center items-center">
				<input
					type="text"
					class="block w-full rounded-lg px-4 py-2 bg-slate-300 shadow-lg text-black placeholder:text-slate-700"
					placeholder="Search relic..."
					bind:value={search}
				/>
				<button
					type="button"
					class="absolute right-2 text-2xl text-slate-700"
					on:click={() => (search = '')}
				>
					<span class="fas {search.length > 0 ? 'fa-times' : 'fa-magnifying-glass'}"></span>
				</button>
			</div>
		</div>

		<div class="max-h-[80%] overflow-y-auto flex justify-center">
			<div class="grid grid-cols-3 lg:grid-cols-3 gap-4 px-5">
				{#each relic_list as relicOption}
					{#if shouldRenderRelic(relicOption)}
						<button
							type="button"
							class="w-full h-full grid"
							on:click={() => handleRelicClick(relicOption)}
						>
							<img
								src={get_relic_splash(relicOption.id, relicIndex)}
								alt="relic_{relicOption.id}"
								class="object-cover bg-yellow-700 rounded-lg w-full aspect-square"
								on:error={handleErrorRelicSplash}
							/>
							<div class="text-sm text-white text-center w-full">
								{relicOption.name}
							</div>
						</button>
					{/if}
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
