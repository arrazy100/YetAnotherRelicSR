import { get, writable, type Writable } from "svelte/store";
import type { Character, Relic, Substat } from "../models/relic_data";

const characters_local = localStorage.characters ? JSON.parse(localStorage.characters) : [];
export const characters: Writable<Character[]> = writable(characters_local);
characters.subscribe((value) => localStorage.characters = JSON.stringify(value));

export const updateRelic = (character: Character, relicIndex: number, newRelic: Relic) => {
    characters.update(chars => {
        character.relics[relicIndex] = newRelic;
        return chars;
    });
};

export const characterIndex = writable(0);
export const currentCharacter: Writable<Character> = writable(get(characters)[get(characterIndex)]);