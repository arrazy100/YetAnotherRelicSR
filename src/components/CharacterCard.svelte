<script lang="ts">
	import { currentCharacter } from "../stores/store";
	import { get_character_splash } from "../utils/relic_util";
	import CharacterSelectCard from "./CharacterSelectCard.svelte";
	import RelicCard from "./RelicCard.svelte";
    import placeholder from '../assets/placeholder.png';

    // variables
    let characterPopUpShow = false;

    // reactivity
	$: characterSplash = $currentCharacter ? get_character_splash($currentCharacter.id) : '';

    // methods
    const handleErrorCharacterSplash = () => {
        characterSplash = placeholder;
    }
</script>

<div class="bg-slate-950 shadow-lg overflow-y-auto overflow-x-auto w-full h-full">
    <CharacterSelectCard bind:show={characterPopUpShow} />

    {#if $currentCharacter}
        <div
            class="flex flex-col bg-slate-800 mx-10 sm:mx-20 md:mx-30 lg:mx-40 my-10 p-10 rounded-lg items-center justify-center"
        >
            <div class="flex w-full flex-col justify-center items-center mb-10">
                <div class="text-white text-2xl mb-5 font-bold">{$currentCharacter?.name}</div>
                <button
                    class="max-w-[50vw] flex justify-center items-center rounded-lg shadow-lg {$currentCharacter?.rank === 5 ? 'bg-yellow-700' : 'bg-purple-700'} opacity-100"
                    type="button"
                    on:click|stopPropagation={() => (characterPopUpShow = !characterPopUpShow)}
                >
                    <img class="object-cover" src={characterSplash} alt={$currentCharacter?.name} on:error={handleErrorCharacterSplash} />
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each $currentCharacter?.relics as _, relicIndex}
                    <RelicCard {relicIndex} />
                {/each}
            </div>
        </div>
    {/if}

    <slot></slot>
</div>