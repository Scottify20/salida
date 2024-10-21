export class SalidaError extends Error {
  constructor(
    public override message: string,
    public code: string,
  ) {
    super(message);
    this.name = 'Salida Error';
  }
}

export type SalidaErrorCodes = SalidaAuthErrorCode | 'unknown-error';
export type SalidaErrorSource = SalidaAuthErrorSource | 'unknown';

export type SalidaAuthErrorCode =
  | 'auth/no-associated-email'
  | 'auth/user-does-not-exist'
  | 'auth/no-username-provided'
  | 'auth/invalid-token'
  | 'auth/username-already-in-use'
  | 'auth/internal-error'
  | 'auth/cannot-connect-to-server'
  | 'auth/invalid-credentials'
  | 'auth/username-already-set';

export type SalidaAuthErrorSource =
  | 'password'
  | 'general'
  | 'username'
  | 'email'
  | 'server';
