import { Component, OnInit } from '@angular/core';

import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../shared/login-request.model';
import { AccountService } from '../../core/account.service';

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
    private _snackBar: MatSnackBar,
    private accountService: AccountService,
    public router: Router
  ) {}

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

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
            this.router.navigateByUrl(redirect);
          }
        },
        (error) => {
          this.message = error;
          this._snackBar.open(JSON.stringify(this.message), '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: ['err-snackbar'],
            duration: 1000,
          });
        }
      );
    } //
    else {
      this._snackBar.open('❗️ لطفا مقادیر وارد شده را بررسی نمایید', '', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        direction: 'rtl',
        panelClass: ['warn-snackbar'],
        duration: 1000,
      });
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
    const snackBarRef = this._snackBar.open('ورود موفق', 'انتقال به داشبورد', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      direction: 'rtl',
      duration: 3000,
    });
    snackBarRef.afterDismissed().subscribe((info) => {
      if (info.dismissedByAction === true) {
        console.log('dismissedByAction');
      } else {
        console.log('dismissed', info);
      }
    });
  }
}
