import { SalidaErrorCodes, SalidaErrorSource } from './SalidaError';

export interface SalidaResponse {
  stack?: string;
  data?: Object;
  code?: SalidaErrorCodes;
  source?: SalidaErrorSource;
  message: string;
}
