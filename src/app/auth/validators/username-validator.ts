import { AbstractControl, ValidatorFn } from '@angular/forms';

export function usernameValidator(): ValidatorFn {
  const usernameRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[A-Za-z\d!"#$%&'()*+,-./:;<=>?@\[\]\^_`{|}\\~]{8,20}$/;
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!usernameRegex.test(control.value)) {
      return {
        invalidPassword: {
          minLength: control.value.length < 8,
          maxLength: control.value.length > 20,
          hasUppercase: /(?=.*[A-Z])/.test(control.value),
          containsWhitespace: /\s+/.test(control.value),
          invalidCharacter:
            !/^[A-Za-z\d!"#$%&'()*+,-./:;<=>?@\[\]\^_`{|}\\~\s]+$/.test(
              control.value,
            ),
          // spaces are not included in the invalidCharacter test to prevent overlap with containWhitespace
        },
      };
    }
    return null;
  };
}
