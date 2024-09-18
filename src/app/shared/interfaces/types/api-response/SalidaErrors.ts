export type SalidaErrorCodes = SalidaAuthErrorCode | 'unknown-error';
export type SalidaErrorSource = SalidaAuthErrorSource | 'unknown';

export type SalidaAuthErrorCode =
  | 'auth/no-associated-email'
  | 'auth/user-does-not-exist'
  | 'auth/no-username-provided'
  | 'auth/cannot-connect-to-server';

export type SalidaAuthErrorSource =
  | 'password'
  | 'general'
  | 'username'
  | 'email';
