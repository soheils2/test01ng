import { AccountService } from 'src/app/core/account.service';
import { Injectable } from '@angular/core';

import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { Dash } from './dash-response.model';

@Injectable({
  providedIn: 'root',
})
export class DashResolverService implements Resolve<{ dash: boolean | Dash }> {
  constructor(private accountService: AccountService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ dash: boolean | Dash }> {
    return this.accountService.getDashboard().pipe(
      catchError((error) => this.router.navigate(['/'])), // Navigate to users list at error
      take(1),
      map((results) => {
        // console.log('here is resolver:', results);
        return { dash: results };
      })
    );
  }
}
