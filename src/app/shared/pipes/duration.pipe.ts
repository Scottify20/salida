import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(
    value: number,
    inputUnit: 'seconds' | 'minutes' | 'hours' | 'weeks' = 'seconds',
  ): string {
    if (isNaN(value) || value < 0) {
      return 'Invalid Input';
    }

    let seconds: number;
    switch (inputUnit) {
      case 'seconds':
        seconds = value;
        break;
      case 'minutes':
        seconds = value * 60;
        break;
      case 'hours':
        seconds = value * 3600;
        break;
      case 'weeks':
        seconds = value * 604800; // 60 seconds * 60 minutes * 24 hours * 7 days
        break;
      default:
        seconds = value;
    }

    const weeks = Math.floor(seconds / 604800);
    const days = Math.floor((seconds % 604800) / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const weeksString = weeks > 0 ? `${weeks}w ` : '';
    const daysString = days > 0 ? `${days}d ` : '';
    const hoursString = hours > 0 ? `${hours}h ` : '';
    const minutesString = minutes > 0 ? `${minutes}m` : '';

    return weeksString + daysString + hoursString + minutesString;
  }
}
