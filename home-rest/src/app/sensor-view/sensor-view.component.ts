import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfo} from '../device-info';
import {ApiResponse, DeviceCallerService} from '../device-caller.service';
import * as devicesIcons from '../../icons.json';
import {NgClass} from '@angular/common';
import {catchError, interval, of, startWith, Subscription, switchMap} from 'rxjs';
import {NotificationService} from '../notification.service';
import {getDeviceFontClass} from '../toast.service';
@Component({
  selector: 'app-sensor-view',
  imports: [
    NgClass
  ],
  templateUrl: './sensor-view.component.html',
  styleUrl: './sensor-view.component.css'
})
export class SensorViewComponent implements OnInit, OnDestroy {
  @Input() sensor!: DeviceInfo;

  deviceCaller = inject(DeviceCallerService)
  notificationService: NotificationService = inject(NotificationService);
  private timer?: Subscription;

  iconListOn: string[] = devicesIcons['switch_on'];
  iconListOff: string[] = devicesIcons['switch_off'];
  iconListNeutral: string[] = devicesIcons['neutral'];
  iconListErrors: string[] = devicesIcons['error'];
  status: string = "";
  lastStatus: string = "";
  unit: string = "";

  apiStatus: ApiResponse = ApiResponse.Offline;

  ngOnInit(): void {
    this.timer = interval(2000)
      .pipe(
        startWith(0),
        switchMap(() => this.deviceCaller.getSensor(this.sensor!.endpoint).pipe(
          catchError(_ => {
            return of(null);
          })
        ))
      )
      .subscribe({
        next: sensor => {
          this.status = '';
          this.unit = '';
          this.apiStatus = ApiResponse.Offline;

          if(!sensor) return;
          this.apiStatus = ApiResponse.Unknown;

          if(sensor.value && (this.sensor.type === "digital" && isNaN(parseFloat(sensor.value))) || (this.sensor.type === "analog" && !isNaN(parseFloat(sensor.value)))) {
            this.status = sensor.value.toLowerCase();
            if(this.lastStatus !== this.status)
            {
              if(this.sensor.notification && this.lastStatus !== "") {
                this.notificationService.show(`${sensor.sensor}: ${sensor.value}${sensor.unit}`)
              }
              this.lastStatus = this.status;
            }
            this.unit = sensor.unit;
            this.apiStatus = ApiResponse.Online;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.timer?.unsubscribe();
  }

  protected readonly ApiResponse = ApiResponse;
  protected readonly getDeviceFontClass = getDeviceFontClass;
}
