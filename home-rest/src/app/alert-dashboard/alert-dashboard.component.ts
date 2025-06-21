import {Component, inject, OnInit} from '@angular/core';
import {FirebaseService} from '../firebase.service';
import {DeviceViewComponent} from '../device-view/device-view.component';
import {NgForOf, NgIf} from '@angular/common';
import {DeviceInfo} from '../device-info';
import {Router} from '@angular/router';
import {SensorViewComponent} from '../sensor-view/sensor-view.component';
import {AlertView} from '../alert-view/alert-view';

@Component({
  selector: 'app-alert-dashboard',
  imports: [
    DeviceViewComponent,
    NgForOf,
    NgIf,
    SensorViewComponent,
    AlertView
  ],
  templateUrl: './alert-dashboard.component.html',
  styleUrl: './alert-dashboard.component.css'
})
export class AlertDashboardComponent implements OnInit{
  router: Router = inject(Router);
  firebaseService: FirebaseService = inject(FirebaseService);

  devices: DeviceInfo[] = [];
  sensors: DeviceInfo[] = [];

  ngOnInit(): void {
    this.firebaseService.getDevices("devices").subscribe(devices => {
      this.devices = devices;
    })
    this.firebaseService.getDevices("sensors").subscribe(sensors => {
      this.sensors = sensors;
    })
  }
}
