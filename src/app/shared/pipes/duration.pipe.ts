import { Pipe, PipeTransform } from '@angular/core';
import { FormatService } from '../services/utility/format.service';

type DurationUnits = 'y' | 'mo' | 'w' | 'd' | 'h' | 'min' | 's' | 'ms';

/**
 * This pipe transforms a given duration in milliseconds, seconds, minutes, hours, or weeks into a human-readable string format.
 *
 * @param value - The duration value to be transformed.
 * @param inputUnit - The unit of the input value. Can be 'milliseconds', 'seconds', 'minutes', 'hours', or 'weeks'.
 * @param units - An array of units to be included in the output. The units must be in order from largest to smallest.
 *                The available units are:
 *                'y'  - years
 *                'mo' - months
 *                'w'  - weeks
 *                'd'  - days
 *                'h'  - hours
 *                'mn' - minutes
 *                's'  - seconds
 *                'ms' - milliseconds
 * @param decimals - The number of decimal places to include for the highest unit not fully represented by lower units.
 * @returns A human-readable string representing the duration.
 */
@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  constructor(private formatService: FormatService) {}

  transform(
    value: number | string,
    inputUnit: DurationUnits = 's',
    units: DurationUnits[] = ['y', 'mo', 'w', 'd', 'h', 'min', 's', 'ms'],
  ): string {
    return this.formatService.formatDuration(value, inputUnit, units);
  }
}
