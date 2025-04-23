import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {authGuardGuard} from './core/guard/auth/auth-guard.guard';
import {Role} from './role.module';
import {StatisticComponent} from './pages/dashboard/admin/statistic/statistic.component';
import {UserPageComponent} from './pages/dashboard/admin/user/user-page/user-page.component';
import {roleGuardGuard} from './core/guard/role/role-guard.guard';
import {FormPageComponent} from './pages/dashboard/admin/user/form-page/form-page.component';
import {HomeComponent} from './pages/home/home.component';
import {EquipePageComponent} from './pages/dashboard/equipe/equipe-page/equipe-page.component';
import {EquipeFormComponent} from './pages/dashboard/equipe/equipe-form/equipe-form.component';
import {EquipementPageComponent} from './pages/dashboard/equipement/equipement-page/equipement-page.component';
import {InterventionPageComponent} from './pages/dashboard/intervention/intervention-page/intervention-page.component';

export const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [authGuardGuard],
    children: [
      {
        path: 'dashboard',
        component: StatisticComponent,
        canActivate: [authGuardGuard],
        data: {roles: [Role.ADMIN]}
      },
      {
        path: "statistic",
        component: StatisticComponent,
        canActivate: [authGuardGuard],
        data: {roles: [Role.ADMIN]}
      },
      {
        path: "users",
        component: UserPageComponent,
        canActivate: [authGuardGuard, roleGuardGuard],
        data: {roles: [Role.ADMIN]},
        children: [
          {
            path: "update",
            component: FormPageComponent,
          }
        ]
      },
      {
        path: "equipe",
        component: EquipePageComponent,
      },
      {
        path: "equipe/create",
        component: EquipeFormComponent,
      },
      {
        path: "equipement",
        component: EquipementPageComponent,
      },
      {
        path: "intervention",
        component: InterventionPageComponent
      }
    ]
  },

  {path: '**', redirectTo: ''}
];
