/**
 * Convert weight from kg to lbs
 */
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

/**
 * Convert weight from lbs to kg
 */
export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

/**
 * Format weight with the given unit
 */
export function formatWeight(weight: number, unit: string): string {
  return `${weight.toFixed(1)} ${unit}`;
}

/**
 * Convert weight between units
 */
export function convertWeight(weight: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) {
    return weight;
  }
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return kgToLbs(weight);
  }
  
  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return lbsToKg(weight);
  }
  
  return weight;
} 