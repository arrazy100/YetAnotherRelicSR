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
	import { clickOutside } from '../utils/util';

	// props
	export let menuOpen = false;
</script>

{#if menuOpen}
	<div
		use:clickOutside
		on:click_outside={() => (menuOpen = false)}
		class="menu z-20 h-full transform bg-slate-900 transition-transform {menuOpen
			? 'translate-x-0'
			: '-translate-x-full'} fixed left-0 top-0 max-h-screen overflow-y-auto"
	>
		<button
			class="absolute right-4 top-4 rounded bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 active:bg-slate-700"
			on:click={() => (menuOpen = false)}
		>
			<span class="fas fa-times"></span>
		</button>
		<div class="mt-10 h-fit w-full p-4">
			<div class="flex w-full flex-col items-center p-4">
				<a
					href="/"
					class="mb-4 text-center text-2xl font-bold text-white"
					on:click={() => (menuOpen = false)}>YET ANOTHER RELIC SETUP</a
				>

				<!-- SEPARATOR -->
				<div class="w-full bg-slate-900 py-4 text-slate-300">
					<div class="border-t border-slate-700"></div>
				</div>

				<div class="w-full">
					{#each $characters as character}
						<div class="my-2">
							<a
								href="/character/{character.id}"
								on:click={() => (menuOpen = false)}
								class="block w-full rounded p-2 text-white hover:text-orange-500 focus:underline active:text-purple-500"
							>
								{character.name}
							</a>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<slot></slot>
	</div>
{/if}
