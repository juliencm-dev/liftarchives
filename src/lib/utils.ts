import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertWeightToLbs = (
  weight: number,
  weightPreference: string
): string => {
  if (weightPreference === "lbs") {
    return (weight * 2.20462).toFixed(2);
  }
  return weight.toFixed(2);
};

export const convertWeightToKg = (
  weight: number,
  weightPreference: string
): string => {
  if (weightPreference === "lbs") {
    return (weight / 2.20462).toFixed(2);
  }
  return weight.toFixed(2);
};

export const clamp = (val: number, min: number, max: number): number =>
  Math.min(Math.max(val, min), max);
