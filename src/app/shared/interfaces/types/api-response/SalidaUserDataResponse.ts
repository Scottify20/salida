import { UserInFireStore } from '../../models/user/User';
import { SalidaResponse } from './SalidaResponse';

export interface SalidaUserDataReponse extends SalidaResponse {
  data: UserInFireStore;
}
