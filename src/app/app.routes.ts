import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {DeviceDashboardComponent} from './device-dashboard/device-dashboard.component';
import {SensorDashboardComponent} from './sensor-dashboard/sensor-dashboard.component';
import {HomeDashboardComponent} from './home-dashboard/home-dashboard.component';

export const routes: Routes = [
  {
    path:'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path:'register',
    component: RegistrationComponent,
    title: 'Register',
  },
  {
    path: 'devices',
    component: DeviceDashboardComponent,
    title: 'Devices',
  },
  {
    path: 'sensors',
    component: SensorDashboardComponent,
    title: 'Sensors',
  },
  {
    path: '',
    component: HomeDashboardComponent,
    title: 'Home',
  }
];
