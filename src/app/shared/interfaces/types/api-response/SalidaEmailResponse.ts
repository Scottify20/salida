import { SalidaAuthErrorCode, SalidaAuthErrorSource } from './SalidaError';
import { SalidaResponse } from './SalidaResponse';

export interface SalidaEmailResponse extends SalidaResponse {
  data?: { email: string };
  error?: { code: SalidaAuthErrorCode; source: SalidaAuthErrorSource };
}
