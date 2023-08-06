import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  constructor(private _snackBar: MatSnackBar) {}

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  success(msg: string, duration: number = 1600, isFa: boolean = true) {
    // const snackBarRef =
    this._snackBar.open(msg, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      direction: isFa ? 'rtl' : 'ltr',
      panelClass: ['success-snackbar'],
      duration,
    });
    // snackBarRef.afterDismissed().subscribe((info) => {
    //   if (info.dismissedByAction === true) {
    //     console.log('dismissedByAction');
    //   } else {
    //     console.log('dismissed', info);
    //   }
    // });
  }
  warn(msg: string, duration: number = 1600, isFa: boolean = true) {
    this._snackBar.open(msg, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      direction: isFa ? 'rtl' : 'ltr',
      panelClass: ['warn-snackbar'],
      duration,
    });
  }
  err(msg: string, duration: number = 1600, isFa: boolean = true) {
    this._snackBar.open(msg, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      direction: isFa ? 'rtl' : 'ltr',
      panelClass: ['err-snackbar'],
      duration,
    });
  }
}
