import { Component } from '@angular/core';
import {DeviceDashboardComponent} from '../device-dashboard/device-dashboard.component';
import {SensorDashboardComponent} from '../sensor-dashboard/sensor-dashboard.component';

@Component({
  selector: 'app-home-dashboard',
  imports: [
    DeviceDashboardComponent,
    SensorDashboardComponent
  ],
  templateUrl: './home-dashboard.component.html',
  styleUrl: './home-dashboard.component.css'
})
export class HomeDashboardComponent {

}
