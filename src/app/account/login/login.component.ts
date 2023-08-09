import { PRESET_LoginRequest } from './../../shared/login-request.model';
import { Component, OnInit, ViewChild } from '@angular/core';

import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../shared/login-request.model';
import { AccountService } from '../../core/account.service';
import { NotifyService } from 'src/app/shared/notify.service';
import {
  Register,
  PRESET_RegisterRequest,
} from 'src/app/shared/register.model';

enum STTs {
  Login = 0,
  Register = 1,
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  status = this.accountService.isAuthenticated
    ? 'Authenticated!'
    : 'Unauthenticated!';
  submitAttempted = false;
  message = '';

  inUse: boolean = false;

  @ViewChild('registerForm') registerForm: FormGroup;
  @ViewChild('loginFrom') loginFrom: FormGroup;

  sttTypes = STTs;
  sttState = this.sttTypes.Login;
  setSttState(_state: STTs) {
    this.sttState = _state;
  }
  credentials = {
    username: '',
    password: '',
    re_password: '',
    isSuperUser: false,
  };

  ngOnInit() {
    this.credentials = {
      username: '',
      password: '',
      re_password: '',
      isSuperUser: false,
    };
    if (this.accountService.isAuthenticated) this.router.navigate(['/']);
  }

  constructor(
    private notify: NotifyService,
    private accountService: AccountService,
    public router: Router
  ) {}

  onLogin(_form: any) {
    this.submitAttempted = true;
    // console.warn('_form:', this.credentials.isSuperUser);

    if (_form.valid) {
      let loginVM: LoginRequest = {
        ...PRESET_LoginRequest,
        email: this.credentials.username,
        password: this.credentials.password,
        isSuperUser: this.credentials.isSuperUser,
      };

      this.accountService.login(loginVM).subscribe({
        complete: () => {
          this.status = this.accountService.isAuthenticated
            ? 'Authenticated!'
            : 'Unauthenticated!';

          if (this.accountService.isAuthenticated) {
            let redirect = this.accountService.redirectUrl
              ? this.router.parseUrl(this.accountService.redirectUrl)
              : '/';

            this.accountService.redirectUrl = null;
            this.loginSucces();
            setTimeout(() => {
              this.router.navigateByUrl(redirect);
            }, 1600);
          }
        },
        error: (error) => {
          this.notify.err('اطلاعات ورودی نادرست میباشد.');
        },
      });
    } //
    else {
      this.notify.warn('❗️ لطفا مقادیر وارد شده را بررسی نمایید');
    }
  }
  onRegister(_form: any) {
    this.submitAttempted = true;
    // console.warn('_form:', _form);
    if (_form.valid) {
      let registerVM: Register = {
        ...PRESET_RegisterRequest,
        email: this.credentials.username,
        password: this.credentials.password,
        confirmPassword: this.credentials.re_password,
      };
      if (registerVM.password != registerVM.confirmPassword) {
        this.notify.warn('رمز های وارد شده همخوانی ندارد');
        return;
      } else {
        this.accountService.register(registerVM).subscribe({
          complete: () => {
            console.log('complete', this.loginFrom);
            this.notify.success('ثبت نام با موفقیت انجام شد لطفا وارد شوید');
            this.sttState = this.sttTypes.Login;
          },
          error: (error) => {
            let _sttCode = error.status;
            console.log('error 2!', error);
            if (_sttCode == 409) {
              this.registerForm.controls['email'].setErrors({ inUse: true });
            } else {
              this.notify.warn('فرمت اطلاعات وارد شده ناقص یا نادرست است');
            }
          },
          next: (response) => {
            // console.log('next', response);
          },
        });
      }
    } //
    else {
      this.notify.warn('❗️ لطفا مقادیر وارد شده را بررسی نمایید');
    }
  }

  log(x: any) {
    console.log(x);
  }

  loginSucces() {
    this.notify.success('ورود موفق ِدرحال انتقال به داشبورد', 3000);
  }
}
