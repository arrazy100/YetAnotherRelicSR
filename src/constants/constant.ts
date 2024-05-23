export const BodyOption = {
    "hp%": 1,
    "atk%": 2,
    "def%": 3,
    "crit rate": 4,
    "crit damage": 5,
    "outgoing healing bonus": 6,
    "effect hit rate": 7
}

export const BootsOption = {
    "hp%": 1,
    "atk%": 2,
    "def%": 3,
    "speed": 4
}

export const PlanarOption = {
    "hp%": 1,
    "atk%": 2,
    "def%": 3,
    "physical damage": 4,
    "fire damage": 5,
    "ice damage": 6,
    "lightning damage": 7,
    "wind damage": 8,
    "quantum damage": 9,
    "imaginary damage": 10
}

export const RopeOption = {
    "break effect": 1,
    "energy": 2,
    "hp%": 3,
    "atk%": 4,
    "def%": 5
}

export const SubstatOption = {
    "hp": 1,
    "atk": 2,
    "def": 3,
    "hp%": 4,
    "atk%": 5,
    "def%": 6,
    "speed": 7,
    "crit rate": 8,
    "crit damage": 9,
    "effect hit rate": 10,
    "effect res": 11,
    "break effect": 12
}

export const get_by_value = (object: any, value: number): string => {
    const key = Object.keys(object).find(key => object[key] === value);

    if (key === undefined) return '';
    return key;
}