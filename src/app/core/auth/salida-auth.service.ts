import { Injectable } from '@angular/core';
import { SalidaAuthErrorSource } from '../../shared/interfaces/types/api-response/SalidaErrors';
import { SalidaAuthError } from '../../shared/models/errors/SalidaAuthError';

@Injectable({
  providedIn: 'root',
})
export class SalidaAuthService {
  constructor() {}

  getSalidAuthErrorMessage(error: SalidaAuthError): {
    errorSource: SalidaAuthErrorSource;
    message: string;
  } {
    let errorSource: SalidaAuthErrorSource = 'general';
    let message = 'Unexpected error. Try again or contact the developer.';

    switch (error.code) {
      case 'auth/no-associated-email':
        errorSource = 'username';
        message =
          "Couldn't find your account. Try logging in with your email instead.";
        break;
      case 'auth/user-does-not-exist':
        message = "Couldn't find your account.";
        errorSource = 'username';
        break;

      case 'auth/cannot-connect-to-server':
        message =
          'Failed to connect to the server. Check your internet connection or contact the developer';
        break;
    }
    return { errorSource, message };
  }
}
