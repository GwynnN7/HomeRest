import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {DeviceDashboardComponent} from './device-dashboard/device-dashboard.component';
import {SensorDashboardComponent} from './sensor-dashboard/sensor-dashboard.component';
import { authGuard, noAuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path:'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [noAuthGuard]
  },
  {
    path:'register',
    component: RegistrationComponent,
    title: 'Register',
    canActivate: [noAuthGuard],
  },
  {
    path: 'devices',
    component: DeviceDashboardComponent,
    title: 'Devices',
    canActivate: [authGuard],
  },
  {
    path: 'sensors',
    component: SensorDashboardComponent,
    title: 'Sensors',
    canActivate: [authGuard],
  },
];
