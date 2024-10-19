import { UserDataInFireStore } from '../../models/user/User';
import { SalidaAuthErrorCode, SalidaAuthErrorSource } from './SalidaError';
import { SalidaResponse } from './SalidaResponse';

export interface SalidaGetUserDataResponse extends SalidaResponse {
  data: UserDataInFireStore;
}

export interface SalidaRegisterUserResponse extends SalidaResponse {
  error?: { code: SalidaAuthErrorCode; source: SalidaAuthErrorSource };
}
