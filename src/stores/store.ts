import { get, writable, type Writable } from "svelte/store";
import type { Character, Relic, Substat } from "../models/relic_data";

const characters_local = localStorage.characters ? JSON.parse(localStorage.characters) : [];
export const characters: Writable<Character[]> = writable(characters_local);
characters.subscribe((value) => localStorage.characters = JSON.stringify(value));