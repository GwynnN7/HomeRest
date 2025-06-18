import { Component } from '@angular/core';
import {DeviceDashboardComponent} from '../device-dashboard/device-dashboard.component';
import {SensorDashboardComponent} from '../sensor-dashboard/sensor-dashboard.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    DeviceDashboardComponent,
    SensorDashboardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
