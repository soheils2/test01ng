import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LoginComponent } from './account/login/login.component';
import { DashboardComponent } from './users/dashboard/dashboard.component';

import { AuthGuard } from './core/auth.guard';
import {
  DashResolverService,
  UserListResolverService,
} from './shared/account-resolvers.service';

import { ConfirmEmailComponent } from './account/confirm-email/confirm-email.component';
import { SupportComponent } from './users/admin/admin.component';
import { PasswordChange } from './shared/password-change.model';
import { PasswordChangeComponent } from './users/password-change/password-change.component';
import { UserDeleteComponent } from './users/user-delete/user-delete.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    //  redirectTo: 'dash', pathMatch: 'full' ,
    // { path: 'signup', component: RegisterComponent },
    // { path: 'dash', component: DashboardComponent, canActivate: [AuthGuard] },
    // { path: 'auth', component: AuthComponent },
    // { path: 'support', component: SupportComponent },
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { allowedRoles: ['user'] },
        resolve: { resolvedValues: DashResolverService },
      },
      {
        path: 'support',
        component: SupportComponent,
        canActivate: [AuthGuard],
        data: { allowedRoles: ['support'] },
        resolve: { resolvedValues: UserListResolverService },
      },
      {
        path: 'password-change/:id',
        component: PasswordChangeComponent,
        canActivate: [AuthGuard],
        data: { allowedRoles: ['support'] },
        // resolve: { resolvedValues: UserListResolverService },
      },
      {
        path: 'user-delete/:id',
        component: UserDeleteComponent,
        canActivate: [AuthGuard],
        data: { allowedRoles: ['support'] },
        // resolve: { resolvedValues: UserListResolverService },
      },
      {
        path: 'verfyEmail/:token',
        component: ConfirmEmailComponent,
        // canActivate: [AuthGuard],
        // data: { allowedRoles: ['user'] },
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
