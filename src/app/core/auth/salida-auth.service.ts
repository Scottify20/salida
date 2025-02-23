import { Injectable, inject } from '@angular/core';
import { SalidaAuthErrorSource } from '../../shared/interfaces/types/api-response/SalidaError';
import { SalidaAuthError } from '../../shared/interfaces/types/api-response/SalidaAuthError';

import { environment } from '../../../environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { SalidaEmailResponse } from '../../shared/interfaces/types/api-response/SalidaEmailResponse';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SalidaAuthService {
  private http = inject(HttpClient);


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
      case 'auth/invalid-token':
        message = 'Your credentials are invalid.';
        break;

      case 'auth/username-already-in-use':
        message = 'That username is already taken.';
        break;
      case 'auth/username-already-set':
        message = 'Your username was already set and cannot be changed.';
        break;
      case 'auth/internal-error':
        break;
    }
    return { errorSource, message };
  }

  getUserEmailByUsername$(username: string): Observable<SalidaEmailResponse> {
    const baseUrlPublic = `${environment.SALIDA_API_BASE_URL}/api/v1/public/users`;

    return this.http
      .get<SalidaEmailResponse>(`${baseUrlPublic}/${username}/email`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          // console.log(error);
          throw error;
        }),
      );
  }
}
