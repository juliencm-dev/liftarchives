import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertWeightToLbs = (weight: number, weightPreference: string): string => {
  if (weightPreference === "lbs") {
    return (weight * 2.20462).toFixed(2);
  }
  return weight.toFixed(2);
};

export const convertWeightToKg = (weight: number, weightPreference: string): string => {
  if (weightPreference === "lbs") {
    return (weight / 2.20462).toFixed(2);
  }
  return weight.toFixed(2);
};

export const computeSinclairCoefficient = (bodyWeight: number, A: number, referenceBodyWeight: number): number => {
  return 10 ** (A * Math.log10(bodyWeight / referenceBodyWeight) ** 2);
};

export const computeStandardizedTotal = (total: number, sinclair: number, ageFactor: number): string => {
  return (total * (sinclair * ageFactor)).toFixed(2);
};

export const clamp = (val: number, min: number, max: number): number => Math.min(Math.max(val, min), max);
