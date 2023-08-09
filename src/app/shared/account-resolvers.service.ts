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
import { PageUsers } from './page-users.model';

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
  ): Observable<{ dash: boolean | Dash }> | Observable<never> {
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

@Injectable({
  providedIn: 'root',
})
export class UserListResolverService implements Resolve<PageUsers> {
  constructor(private accountService: AccountService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PageUsers> | Observable<never> {
    // const page = +route.queryParamMap.get('page') || 1;
    // const pageSize = +route.queryParamMap.get('pageSize') || 10;
    // const sortOrder = route.queryParamMap.get('sortOrder') || 'Fname';
    // const searchString = route.queryParamMap.get('searchString') || '';

    return this.accountService
      .getPageUsers(/*page, pageSize, sortOrder, searchString*/)
      .pipe(take(1));
  }
}
