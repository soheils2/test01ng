import { Component, OnInit } from '@angular/core';

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

  ngOnInit() {
    this.credentials = { username: '', password: '' };
  }
  credentials = { username: '', password: '' };

  constructor(
    private notify: NotifyService,
    private accountService: AccountService,
    public router: Router
  ) {}

  onLogin(_form: any) {
    this.submitAttempted = true;
    // console.warn('_form:', _form);
    if (_form.valid) {
      let loginVM: LoginRequest = {
        email: this.credentials.username,
        password: this.credentials.password,
      };

      this.accountService.login(loginVM).subscribe(
        (response) => {
          this.status = this.accountService.isAuthenticated
            ? 'Authenticated!'
            : 'Unauthenticated!';
          this.message = response.message;

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
        (error) => {
          this.message = error;
          this.notify.err(JSON.stringify(this.message));
        }
      );
    } //
    else {
      this.notify.warn('❗️ لطفا مقادیر وارد شده را بررسی نمایید');
    }
  }

  log(x: any) {
    console.log(x);
  }
  cop = '';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    pass: new FormControl('', [Validators.email, Validators.required]),
  });

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  loginSucces() {
    this.notify.success('ورود موفق ِدرحال انتقال به داشبورد', 3000);
  }
}
