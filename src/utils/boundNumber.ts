export function boundNumber<TDefault extends number | undefined>(
  value: number,
  defaultValue?: TDefault,
  minimumValue?: number,
  maximumValue?: number
): TDefault extends undefined ? number | null : number {
  if (isNaN(value)) {
    if (defaultValue === undefined) {
      return null as any;
    } else {
      return defaultValue;
    }
  }

  if (minimumValue !== undefined && value < minimumValue) {
    return minimumValue;
  }
  if (maximumValue !== undefined && value > maximumValue) {
    return maximumValue;
  }
  return value;
}
