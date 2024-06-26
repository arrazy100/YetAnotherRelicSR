export class Character {
    id: number;
    name: string;
    rank: number;
    relics: Relic[];

    constructor(id: number, name: string, rank: number, relics: Relic[]) {
        this.id = id;
        this.name = name;
        this.rank = rank;
        this.relics = relics;
    }
}

export class Relic {
    id: number;
    name: string;
    level: number;
    mainstat_id: number;
    mainstat_name: string;
    substats: Substat[];

    constructor(id: number, name: string, level: number, mainstat_id: number, mainstat_name: string, substats: Substat[]) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.mainstat_id = mainstat_id;
        this.mainstat_name = mainstat_name;
        this.substats = substats;
    }
}

export class Substat {
    id: number;
    name: string;
    rolls: number;

    constructor(id: number, name: string, rolls: number) {
        this.id = id;
        this.name = name;
        this.rolls = rolls;
    }
}