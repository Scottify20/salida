import { SalidaErrorCodes, SalidaErrorSource } from './SalidaErrors';

export interface SalidaResponse {
  stack?: string;
  data?: Object;
  code?: SalidaErrorCodes;
  source?: SalidaErrorSource;
  message: string;
}
