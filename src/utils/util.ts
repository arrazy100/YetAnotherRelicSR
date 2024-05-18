import characters from '../db/characters.json';
import lightcones from '../db/lightcones.json';
import relics from '../db/relics.json';
import { CharacterDB, LightconeDB, RelicDB } from '../models/db';

export const get_character_list = (): CharacterDB[] => {
    const data = characters._default;

    const character_list: CharacterDB[] = Object.values(data).reduce((acc: CharacterDB[], key) => {
        const { id, name } = key;
        if (Number(id) < 7000) {
            acc.push(new CharacterDB(Number(id), name));
        }
        return acc;
    }, []);

    return character_list.sort((a, b) => (a.name < b.name ? -1 : 1));
};

export const get_lightcone_list = (): LightconeDB[] => {
    const data = lightcones._default;

    const lightcone_list: LightconeDB[] = Object.values(data).map(key => {
        const { id, name } = key;
        return new LightconeDB(Number(id), name);
    });

    return lightcone_list.sort((a, b) => (a.name < b.name ? -1 : 1));
};

export const get_relic_list = (): RelicDB[] => {
    const data = relics._default;

    const relic_list: RelicDB[] = Object.values(data).map(key => {
        const { id, name } = key;
        return new RelicDB(Number(id), name);
    });

    return relic_list.sort((a, b) => (a.name < b.name ? -1 : 1));
};

export const get_character_name_by_id = (id: number): string => {
    let character = get_character_list().filter(c => c.id === id);

    return character[0].name;
}

export const get_lightcone_name_by_id = (id: number): string => {
    let lightcone = get_lightcone_list().filter(l => l.id === id);

    return lightcone[0].name;
}

export const get_relic_name_by_id = (id: number): string => {
    let relic = get_relic_list().filter(r => r.id === id);

    return relic[0].name;
}

const BASE_CHARACTER_SPLASH_URL = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/image/character_preview';
export const get_character_splash = (id: number): string => {
    return `${BASE_CHARACTER_SPLASH_URL}/${id}.png`;
}

const BASE_RELIC_URL = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/relic';
export const get_relic_splash = (id: number, index: number): string => {
    if (index <= 3) {
        return `${BASE_RELIC_URL}/${id}_${index}.png`;
    }
    else {
        return `${BASE_RELIC_URL}/${id}_${index - 4}.png`;
    }
}