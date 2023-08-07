import { HttpErrorResponse } from '@angular/common/http';
import { Component, ErrorHandler, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, retry, tap, shareReplay } from 'rxjs/operators';
import { AccountService } from 'src/app/core/account.service';
enum CNF_Stt {
  waiting = 0,
  Confirmed = 200,
  Suspended = 400,
  Invalid = 401,
  notFound = 404,
  Duplicated = 409,
  Internal = 500,
}

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
})
export class ConfirmEmailComponent implements OnInit {
  vrToken: string;

  CNF_Type = CNF_Stt;
  cnf_Stt: number = this.CNF_Type.waiting;
  // authStatus: number = CNF_Stt.waiting;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  handleError(error: HttpErrorResponse) {
    console.log('err happnd', error.status);

    this.cnf_Stt = error.status;
    if (error.status == this.CNF_Type.Duplicated) {
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }
    return throwError('Something bad happened; please try again later.');
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => (this.vrToken = params.get('token'))
    );
    setTimeout(() => {
      this.accountService
        .confirmEmail(this.vrToken)
        .pipe(catchError(this.handleError.bind(this)))
        .subscribe((stt) => {
          this.cnf_Stt = this.CNF_Type.Confirmed;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);

          // this.
          // console.log('stt:', stt);
        });
    }, 1500);
  }
}
