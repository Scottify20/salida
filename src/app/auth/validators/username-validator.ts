import { AbstractControl, ValidatorFn } from '@angular/forms';

export function usernameValidator(): ValidatorFn {
  const usernameRegex = /^(?:[a-zA-Z][a-zA-Z0-9\._-]{7,15})$/;
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!usernameRegex.test(control.value)) {
      return {
        invalidUsername: {
          minLength: control.value.length < 8,
          maxLength: control.value.length > 16,
          hasNonLetterAsFirstCharacter: !/^[a-zA-Z]/.test(control.value),
          containsWhitespace: /\s+/.test(control.value),
          invalidCharacter: !/^[a-z0-9\d!-_\.\s]+$/.test(control.value),
          // spaces are not included in the invalidCharacter test to prevent overlap with containWhitespace
        },
      };
    }
    return null;
  };
}

const validUsernameRegex = /^(?:[a-zA-Z][a-zA-Z0-9\._-]{7,15})$/;
