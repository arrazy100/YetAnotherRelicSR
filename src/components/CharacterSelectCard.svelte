<script lang="ts">
	import { get_character_list, get_character_splash } from '../utils/util';

	export let show = false;
</script>

<div
	class="{show
		? 'visible'
		: 'hidden'} block z-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 shadow-lg rounded-lg"
>
	<div class="my-4 text-2xl flex justify-center items-center text-white">
		Character List
		<button
			class="absolute top-4 right-4 bg-slate-950 text-white font-bold rounded-lg shadow-md hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
			on:click={() => {
				show = !show;
			}}
		>
			<i class="fas fa-times"></i>
		</button>
	</div>
	<div class="max-h-[80vh] overflow-y-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-10">
			{#each get_character_list() as character}
				<button type="button" class="w-full h-full flex flex-col justify-center items-center">
					<div class="bg-yellow-700 rounded-lg w-full h-full justify-center items-center">
						<img
							src={get_character_splash(character.id)}
							alt="char_{character.id}"
							class="object-cover"
						/>
					</div>
					<div class="my-1 text-sm text-white text-center">
						{character.name}
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>
<slot></slot>

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
