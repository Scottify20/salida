import { Pipe, PipeTransform } from '@angular/core';
import { FormatService } from '../services/utility/format.service';

/**
 * A pipe that truncates a string to a specified length and appends a trailing string if necessary.
 *
 * @example
 * <!-- In a template -->
 * {{ longText | truncate:[10, '...', 5] }}
 *
 * @example
 * <!-- In a component -->
 * this.truncatePipe.transform('This is a long text', [10, '...', 5]);
 *
 * @param {string | undefined | null} value - The string to be truncated.
 * @param {any[]} args - An array of arguments:
 *  - args[0]: The maximum length of the leading characters (default is 20).
 *  - args[1]: The trailing string to append if truncation occurs (default is '...').
 *  - args[2]: The maximum length of the ending characters (optional).
 *
 * @returns {string} - The truncated string with the trailing string appended if truncation occurs.
 */
@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  constructor(private formatService: FormatService) {}

  transform(value: string | undefined | null, args: any[]): string {
    const leadingLimit = args.length > 0 ? parseInt(args[0], 10) : 20;
    const trail = args.length > 1 ? args[1] : '...';
    const endingLimit = args.length > 2 ? parseInt(args[2], 10) : 0;

    return this.formatService.truncate(value, leadingLimit, trail, endingLimit);
  }
}
