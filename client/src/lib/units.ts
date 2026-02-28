const KG_TO_LB = 2.20462;

/** Convert kg to lb (full precision, round on display) */
export function kgToLb(kg: number): number {
    return kg * KG_TO_LB;
}

/** Convert lb to kg (full precision for DB storage) */
export function lbToKg(lb: number): number {
    return lb / KG_TO_LB;
}

/** Convert a weight stored in kg to the user's display unit, rounded to 1 decimal */
export function displayWeight(weightInKg: number, unit: 'kg' | 'lb'): number {
    if (unit === 'lb') return Math.round(kgToLb(weightInKg) * 10) / 10;
    return weightInKg;
}

/** Convert a user-entered weight to kg for storage */
export function toKg(weight: number, unit: 'kg' | 'lb'): number {
    if (unit === 'lb') return lbToKg(weight);
    return weight;
}
