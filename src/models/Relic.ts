export class Character {
    name: string;
    relics: Relic[];

    constructor(name: string, relics: Relic[]) {
        this.name = name;
        this.relics = relics;
    }
}

export class Relic {
    name: string;
    slot: number;
    level: number;
    mainstat: string;
    substats: Substat[];

    constructor(name: string, slot: number, level: number, mainstat: string, substats: Substat[]) {
        this.name = name;
        this.slot = slot;
        this.level = level;
        this.mainstat = mainstat;
        this.substats = substats;
    }
}

export class Substat {
    name: string;
    rolls: number;

    constructor(name: string, rolls: number) {
        this.name = name;
        this.rolls = rolls;
    }
}