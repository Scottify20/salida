import {
  SalidaAuthErrorCode,
  SalidaAuthErrorSource,
} from '../../interfaces/types/api-response/SalidaErrors';
import { SalidaError } from './SalidaError';

export class SalidaAuthError extends SalidaError {
  constructor(
    public override message: string,
    public override code: SalidaAuthErrorCode,
    public source: SalidaAuthErrorSource,
  ) {
    super(message, code);
    this.name = 'SalidaAuthError';
  }
}

export type SalidaAuthErrors = {
  [key in SalidaAuthErrorSource]?: string | null;
};

export interface SalidaAuthError {
  message: string;
  code: SalidaAuthErrorCode;
  source: SalidaAuthErrorSource;
  name: 'SalidaAuthError';
}
