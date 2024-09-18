import { SalidaAuthErrorCode, SalidaAuthErrorSource } from './SalidaErrors';
import { SalidaResponse } from './SalidaResponse';

export interface SalidaEmailsResponse extends SalidaResponse {
  data?: { emails: string[] };
  error?: { code: SalidaAuthErrorCode; source: SalidaAuthErrorSource };
}
