import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function usernameValidator(): ValidatorFn {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9\._-]{7,15}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && !usernameRegex.test(control.value)) {
      return {
        invalidUsername: {
          minLength: control.value.length < 8,
          maxLength: control.value.length > 20,
          hasNonLetterAsFirstCharacter: !/^[a-zA-Z]/.test(control.value),
          containsWhitespace: /\s/.test(control.value),
          invalidCharacter: !/^[a-zA-Z0-9\s]+$/.test(control.value),
        },
      };
    }
    return null;
  };
}

const validUsernameRegex = /^[a-zA-Z][a-zA-Z0-9\._-]{7,15}$/;
