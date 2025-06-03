import {Component, inject, OnInit} from '@angular/core';
import {FirebaseService} from '../firebase.service';
import {DeviceInfo} from '../device-info';
import {NgForOf} from '@angular/common';
import {SensorViewComponent} from '../sensor-view/sensor-view.component';

@Component({
  selector: 'app-sensor-dashboard',
  imports: [
    SensorViewComponent,
    NgForOf
  ],
  templateUrl: './sensor-dashboard.component.html',
  styleUrl: './sensor-dashboard.component.css'
})
export class SensorDashboardComponent implements OnInit{
  firebaseService: FirebaseService = inject(FirebaseService);
  sensors: DeviceInfo[] = [];

  ngOnInit(): void {
    this.firebaseService.getSensors().then(sensors => {
      this.sensors = sensors;
    })
  }
}
