export class LoginRequest {
  email: string;
  password: string;
  isSuperUser: boolean;
}

export const PRESET_LoginRequest: LoginRequest = {
  email: '',
  password: '',
  isSuperUser: false,
};
