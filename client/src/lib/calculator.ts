export function roundToPlate(weight: number, unit: 'kg' | 'lb'): number {
    if (unit === 'lb') {
        return Math.round(weight / 2.5) * 2.5;
    }
    return Math.round(weight);
}

export function calcPercentage(max: number, percent: number): number {
    return max * (percent / 100);
}

export function calcEpley(weight: number, reps: number): number {
    if (reps <= 0) return 0;
    if (reps === 1) return weight;
    return weight * (1 + reps / 30);
}

export function calcBrzycki(weight: number, reps: number): number {
    if (reps <= 0) return 0;
    if (reps === 1) return weight;
    if (reps >= 37) return 0;
    return weight * (36 / (37 - reps));
}

export function generatePercentageTable(max: number, unit: 'kg' | 'lb'): { percent: number; weight: number }[] {
    const rows: { percent: number; weight: number }[] = [];
    for (let p = 100; p >= 45; p -= 5) {
        rows.push({
            percent: p,
            weight: roundToPlate(calcPercentage(max, p), unit),
        });
    }
    return rows;
}
