import { Injectable } from '@angular/core';
import { SalidaAuthErrorSource } from '../../shared/interfaces/types/api-response/SalidaErrors';
import { SalidaAuthError } from '../../shared/models/errors/SalidaAuthError';

import { environment } from '../../../environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { SalidaEmailsResponse } from '../../shared/interfaces/types/api-response/SalidaEmailsResponse';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SalidaAuthService {
  constructor(private http: HttpClient) {}

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

  getUserEmailsByUsername$(username: string): Observable<SalidaEmailsResponse> {
    const baseUrlPublic = `${environment.SALIDA_API_BASE_URL}/api/v1/public/users`;

    return this.http
      .get<SalidaEmailsResponse>(`${baseUrlPublic}/${username}/emails`)
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
