export class Register {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  recaptcha: string;
}

export let PRESET_RegisterRequest: Register = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  recaptcha: '',
};
