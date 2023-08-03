import { Component } from '@angular/core';

import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(private _snackBar: MatSnackBar, public router: Router) {}

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  onLogin(_form: any) {
    // console.warn('_form:', _form);
    if (_form.valid) {
      const snackBarRef = this._snackBar.open(
        '✅ ورود موفق',
        'انتقال به داشبورد',
        {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          direction: 'rtl',
          panelClass: ['success-snackbar'],
          duration: 2000,
        }
      );
      snackBarRef.afterDismissed().subscribe((info) => {
        this.router.navigate(['dash']);
      });
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

  matcher = new MyErrorStateMatcher();

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
