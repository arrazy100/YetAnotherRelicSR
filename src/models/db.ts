export class CharacterDB {
    id: number;
    name: string;
    rank: number;

    constructor(id: number, name: string, rank: number) {
        this.id = id;
        this.name = name;
        this.rank = rank;
    }
}

export class LightconeDB {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export class RelicDB {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}