import { Injectable, NgZone } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Register } from '../shared/register.model';
import { catchError, retry, tap, shareReplay } from 'rxjs/operators';
import { throwError, of, Observable } from 'rxjs';
import { LoginRequest } from '../shared/login-request.model';
import { LoginResponse } from '../shared/login-response.model';
import { AuthInfo } from '../shared/auth-info.model';
import { ResetPassword } from '../shared/reset-password.model';
import { Dash } from '../shared/dash-response.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {
    this.loadAuthInfo();
  }

  private handleError(error: HttpErrorResponse) {
    console.log('err happnd', error.status);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      return throwError(
        () => new Error('Something bad happened; please try again later.')
      );
    } else if (error.status == 400) {
      // Model validation error, return validation messages.
      return throwError(() => new Error(error.error));
    } else if (error.status == 401) {
      return throwError(() => new Error('Username or password incorrect!'));
    }

    // return an observable with a user-facing error message
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  register(register: Register) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', //,
        // 'Authorization': 'my-auth-token'
      }),
    };

    const url = window['baseUrl'] + '/api/register';
    // const url = "https://localhost:44374/api/Register";

    return this.http.post<Register>(url, register, httpOptions);
    // .pipe(catchError(this.handleError));
    // .pipe(catchError(this.handleError('register', user)));
  }

  confirmEmail(vr_token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', //,
        // 'Authorization': 'my-auth-token'
      }),
      // params: new HttpParams().set('verifyToken', vr_token),
    };

    const url = window['baseUrl'] + '/api/verfyEmail/' + vr_token;
    // const url = "https://localhost:44374/api/ConfirmEmail";

    return this.http.get(url, httpOptions);
  }

  reSendEmail() {
    console.log('sending...');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const url = window['baseUrl'] + '/api/resendemail/';
    return this.http.get(url, httpOptions).pipe(catchError(this.handleError));
  }

  redirectUrl: string;

  private _isAuthenticated: boolean = false;
  get isAuthenticated(): boolean {
    return (
      this.token !== '' &&
      this.expiration !== null &&
      this.expiration > Date.now()
    );
  }

  private _token: string = '';
  get token(): string {
    return this._token;
  }

  private _expiration: number = null;
  get expiration(): number {
    return this._expiration;
  }

  private _email: string = '';
  get email(): string {
    return this._email;
  }

  private _role: string = '';
  get role(): string {
    return this._role;
  }

  login(loginRequestVM: LoginRequest) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const url = window['baseUrl'] + '/api/login';

    return this.http.post<LoginResponse>(url, loginRequestVM, httpOptions).pipe(
      shareReplay(),
      catchError(this.handleError),
      tap((response) => this.updateAuthInfo(response))
    );
  }

  getDashboard(): Observable<Dash> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const url = window['baseUrl'] + '/api/dash';

    return this.http.get<Dash>(url, httpOptions);
  }

  updateUser(userVm: Dash) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const url = window['baseUrl'] + '/api/updatedash/';

    return this.http
      .put<Dash>(url, userVm, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private updateAuthInfo(response: LoginResponse) {
    // console.log('updateAuthInfo', response);
    if (response.success === true) {
      this._isAuthenticated = response.success;
      this._token = response.token;
      this._expiration = Date.now() + response.expiresInMinutes * 60000;
      this._email = response.email;
      this._role = response.role;
    } else {
      this._isAuthenticated = false;
      this._token = '';
      this._expiration = null;
      this._email = '';
      this._role = '';
    }

    this.storeAuthInfo();
  }

  private storeAuthInfo() {
    let authInfo: AuthInfo = {
      isAuthenticated: this._isAuthenticated,
      token: this._token,
      expiration: this._expiration,
      email: this._email,
      role: this.role,
    };

    localStorage.setItem('authInfo', JSON.stringify(authInfo));
  }

  private loadAuthInfo() {
    this._isAuthenticated = false;
    this._token = '';
    this._expiration = null;
    this._email = '';
    this._role = '';

    let authInfoString = localStorage.getItem('authInfo');
    if (authInfoString !== null) {
      let authInfo: AuthInfo = JSON.parse(authInfoString);
      typeof authInfo.isAuthenticated !== 'undefined' &&
        (this._isAuthenticated = authInfo.isAuthenticated);
      typeof authInfo.token !== 'undefined' && (this._token = authInfo.token);
      typeof authInfo.expiration !== 'undefined' &&
        (this._expiration = authInfo.expiration);
      typeof authInfo.email !== 'undefined' && (this._email = authInfo.email);
      typeof authInfo.role !== 'undefined' && (this._role = authInfo.role);
    }
  }

  signOut() {
    this._isAuthenticated = false;
    this._token = '';
    this._expiration = null;
    this._email = '';
    this._role = '';

    this.storeAuthInfo();
  }

  forgotPassword(email: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const url = window['baseUrl'] + '/api/forgot-password';
    // const url = "https://localhost:44374/api/Login";

    return this.http.post(url, { email: email }, httpOptions).pipe(
      // retry(3),
      shareReplay(),
      // catchError(this.handleLoginError),
      catchError(this.handleError)
    );
  }

  resetPassword(resetPassword: ResetPassword) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: new HttpParams().set(
        'code',
        encodeURIComponent(resetPassword.code)
      ),
    };

    const url = window['baseUrl'] + '/api/reset-password';
    // const url = "https://localhost:44374/api/Login";

    return this.http.post(url, resetPassword, httpOptions).pipe(
      // retry(3),
      shareReplay(),
      // catchError(this.handleLoginError),
      catchError(this.handleError)
    );
  }
}
