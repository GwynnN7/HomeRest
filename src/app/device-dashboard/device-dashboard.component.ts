import {Component, inject, OnInit} from '@angular/core';
import {FirebaseService} from '../firebase.service';
import {DeviceViewComponent} from '../device-view/device-view.component';
import {NgForOf, NgIf} from '@angular/common';
import {DeviceInfo} from '../device-info';

@Component({
  selector: 'app-device-dashboard',
  imports: [
    DeviceViewComponent,
    NgForOf
  ],
  templateUrl: './device-dashboard.component.html',
  styleUrl: './device-dashboard.component.css'
})
export class DeviceDashboardComponent implements OnInit {
  firebaseService: FirebaseService = inject(FirebaseService);
  devices: DeviceInfo[] = [];

  ngOnInit(): void {
    this.firebaseService.getDevices().then(devices => {
      this.devices = devices;
    })
  }
}
