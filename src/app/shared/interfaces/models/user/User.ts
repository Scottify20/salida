import { UserPreferences } from '../../../services/preferences/temporary-user-preferences-service';

export type UserInFireStore = {
  [key: string]: any;
} & {
  uid: string;
  passwordHash?: string;
  password?: string;
  email?: string;
  displayName?: string;
  username?: string;
  photoURL?: string;
  phoneNumber?: string;
  providerData: SignInProvider[];
  preferences?: UserPreferences;
  role: Role;
  createdAt?: string;
  lastLoginAt?: string;
  updatedAt?: string;
};

interface SignInProvider {
  providerId: string; // google.com, phone, password, etc
  uid: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
}

type Role = 'admin' | 'user' | undefined;