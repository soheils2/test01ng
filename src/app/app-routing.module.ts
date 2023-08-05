import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LoginComponent } from './account/login/login.component';
import { DashboardComponent } from './users/dashboard/dashboard.component';

import { AuthGuard } from './core/auth.guard';

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
