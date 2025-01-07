import { Injectable, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExtractStringService {
  /**
   * Method to get the text from a string, Signal, or function
   */
  extract(
    text:
      | null
      | undefined
      | string
      | Signal<string | null | undefined>
      | (() => string),
  ): string | null | undefined {
    // console.log(text);

    if (!text && text !== '') {
      console.log('failed to extract string possibly undefined, null');
      return '---';
    }
    return typeof text === 'string' ? text : text();
  }
}
