import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfo} from '../device-info';
import {DeviceCallerService} from '../device-caller.service';
import {NgClass, NgForOf} from '@angular/common';
import * as devicesIcons from '../../../devices/icons.json'
import {catchError, interval, of, startWith, Subscription, switchMap} from 'rxjs';

@Component({
  selector: 'app-device-view',
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: './device-view.component.html',
  styleUrl: './device-view.component.css'
})
export class DeviceViewComponent implements OnInit, OnDestroy{
  @Input() device!: DeviceInfo;

  deviceCaller = inject(DeviceCallerService)
  private timer?: Subscription;

  iconListOn: string[] = devicesIcons['switch_on'];
  iconListOff: string[] = devicesIcons['switch_off'];
  iconListNeutral: string[] = devicesIcons['neutral'];
  iconListErrors: string[] = devicesIcons['error'];

  status: string = "";
  apiStatus: number = 0;

  ngOnInit(): void {
    this.timer = interval(2000)
      .pipe(
        startWith(0),
        switchMap(() => this.deviceCaller.getDevice(this.device!.endpoint).pipe(
          catchError(_ => {
            return of(null);
          })
        ))
      )
      .subscribe({
        next: device => {
          this.status = '';
          this.apiStatus = 0;

          if(!device) return;
          this.apiStatus = 1;

          if(device.status && (this.device.type === "digital" && isNaN(parseFloat(device.status))) || (this.device.type === "analog" && !isNaN(parseFloat(device.status)))) {
            this.status = device.status.toLowerCase();
            this.apiStatus = 2;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.timer?.unsubscribe();
  }

  callDeviceEndpoint(action: string, $event: MouseEvent): void {
    this.deviceCaller.postDevice(this.device!.endpoint, action).subscribe(device => {
      this.status = device.status;
    })
    $event.stopPropagation();
  }
}
