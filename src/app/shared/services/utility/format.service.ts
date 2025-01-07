import { Injectable, Signal, WritableSignal } from '@angular/core';
import { ExtractStringService } from './extract-string.service';

type DurationUnits = 'y' | 'mo' | 'w' | 'd' | 'h' | 'min' | 's' | 'ms';

const unitMultipliers: Record<DurationUnits, number> = {
  ms: 1,
  s: 1000,
  min: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
  mo: 30 * 24 * 60 * 60 * 1000, // Approximate
  y: 365 * 24 * 60 * 60 * 1000, // Approximate
};

// Function to get the dynamic maximum value for a unit
function getDynamicMaxValue(
  unit: DurationUnits,
  nextLargerUnit?: DurationUnits,
): number {
  if (!nextLargerUnit) {
    const defaultMaxValues: Record<DurationUnits, number> = {
      ms: 999.999,
      s: 59,
      min: 59,
      h: 23,
      d: 364, //max if year is next
      w: 51, //max if year is next
      mo: 11, //max if year is next
      y: Infinity,
    };
    return defaultMaxValues[unit];
  }

  return unitMultipliers[nextLargerUnit] / unitMultipliers[unit] - 1;
}

@Injectable({
  providedIn: 'root',
})
export class FormatService {
  constructor(private extractStringService: ExtractStringService) {}

  /**
   * Truncates a string to a specified length and appends a trailing string if necessary.
   *
   * @param value - The string to be truncated.
   * @param leadingLimit - The maximum length of the leading characters (default is 20).
   * @param trail - The trailing string to append if truncation occurs (default is '...').
   * @param endingLimit - The maximum length of the ending characters (optional).
   *
   * @returns The truncated string with the trailing string appended if truncation occurs.
   */
  truncate(
    value:
      | null
      | undefined
      | string
      | Signal<string | null | undefined>
      | (() => string),
    leadingLimit: number = 20,
    trail: string = '...',
    endingLimit: number = 0,
  ): string {
    const stringValue = this.extractStringService.extract(value);
    if (!stringValue || stringValue.length < 1) {
      return '';
    }

    if (stringValue.length <= leadingLimit + endingLimit) {
      return stringValue;
    }

    const leadingPart = stringValue.substring(0, leadingLimit);
    const endingPart =
      endingLimit > 0
        ? stringValue.substring(stringValue.length - endingLimit)
        : '';
    return leadingPart + trail + endingPart;
  }

  /**
   * This method transforms a given duration in various units into a human-readable string format.
   *
   * @param value - The duration value to be transformed.
   * @param inputUnit - The unit of the input value. Can be 'y', 'mo', 'w', 'd', 'h', 'mn', 's', or 'ms'.
   * @param units - An array of units to be included in the output. The units must be in order from largest to smallest.
   *                The available units are:
   *                'y'  - years
   *                'mo' - months
   *                'w'  - weeks
   *                'd'  - days
   *                'h'  - hours
   *                'min' - minutes
   *                's'  - seconds
   *                'ms' - milliseconds
   * @returns A human-readable string representing the duration, or an error message if input is invalid.
   */
  formatDuration(
    value: number | string,
    inputUnit: DurationUnits = 's',
    units: DurationUnits[] = ['y', 'mo', 'w', 'd', 'h', 'min', 's', 'ms'],
  ): string {
    value = Number(value);

    if (isNaN(value) || value < 0) {
      return 'Invalid Input';
    }

    let remainingMs = value * unitMultipliers[inputUnit];
    const resultParts: string[] = [];

    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      const nextLargerUnit = units[i - 1];
      let unitValue = Math.floor(remainingMs / unitMultipliers[unit]);

      // Apply dynamicMaxValue only if there is a nextLarger unit
      if (nextLargerUnit) {
        unitValue = Math.min(
          unitValue,
          getDynamicMaxValue(unit, nextLargerUnit),
        );
      }

      if (unitValue >= 1) {
        remainingMs -= unitValue * unitMultipliers[unit];
        resultParts.push(`${unitValue}${unit}`);
      }
    }

    // Decimal override for small values (only apply to the smallest unit)
    if (resultParts.length === 0 && remainingMs > 0) {
      const smallestUnit = units[units.length - 1];
      const smallestUnitValue = remainingMs / unitMultipliers[smallestUnit];
      return `${smallestUnitValue.toFixed(3)}${smallestUnit}`;
    }

    return resultParts.length > 0
      ? resultParts.join(' ')
      : '0' + (units.includes('ms') ? 'ms' : units[units.length - 1] || 'ms');
  }
}
