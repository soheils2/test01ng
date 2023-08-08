import { AccountService } from 'src/app/core/account.service';
import { Injectable } from '@angular/core';

import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { Dash } from './dash-response.model';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root',
})
export class DashResolverService implements Resolve<{ dash: boolean | Dash }> {
  constructor(
    private accountService: AccountService,
    private router: Router,
    private notify: NotifyService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ dash: boolean | Dash }> {
    return this.accountService.getDashboard().pipe(
      catchError((error) => {
        this.accountService.signOut();
        this.router.navigate(['/login']);
        this.notify.err('اکانت شما یافت نشد لطفا دوباره وارد شوید', 3000);
        return throwError(() => new Error(error));
      }), // Navigate to users list at error
      take(1),
      map((results) => {
        console.log('here is resolver:', results);
        return { dash: results };
      })
    );
  }
}
