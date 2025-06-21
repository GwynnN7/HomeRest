import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {DeviceDashboardComponent} from './device-dashboard/device-dashboard.component';
import {SensorDashboardComponent} from './sensor-dashboard/sensor-dashboard.component';
import {authGuard, noAuthGuard, offlineGuard, onlineGuard} from './guards';
import {OfflineComponent} from './offline/offline.component';
import {AccountComponent} from './account/account.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AlertDashboardComponent} from './alert-dashboard/alert-dashboard.component';

export const routes: Routes = [
  {
    path:'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [noAuthGuard, onlineGuard]
  },
  {
    path:'register',
    component: RegistrationComponent,
    title: 'Register',
    canActivate: [noAuthGuard, onlineGuard],
  },
  {
    path:'account',
    component: AccountComponent,
    title: 'Account',
    canActivate: [authGuard, onlineGuard],
  },
  {
    path: '',
    component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [authGuard, onlineGuard],
  },
  {
    path: 'devices',
    component: DeviceDashboardComponent,
    title: 'Devices',
    canActivate: [authGuard, onlineGuard],
  },
  {
    path: 'sensors',
    component: SensorDashboardComponent,
    title: 'Sensors',
    canActivate: [authGuard, onlineGuard],
  },
  {
    path: 'alerts',
    component: AlertDashboardComponent,
    title: 'Alerts',
    canActivate: [authGuard, onlineGuard],
  },
  {
    path: 'offline',
    component: OfflineComponent,
    title: 'Offline',
    canActivate: [offlineGuard],
  }
];
