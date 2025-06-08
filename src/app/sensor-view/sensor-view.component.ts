import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfo} from '../device-info';
import {DeviceCallerService} from '../device-caller.service';
import * as devicesIcons from '../../../devices/icons.json';
import {NgClass} from '@angular/common';
import {catchError, interval, of, startWith, Subscription, switchMap} from 'rxjs';
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
  private timer?: Subscription;

  iconListOn: string[] = devicesIcons['switch_on'];
  iconListOff: string[] = devicesIcons['switch_off'];
  iconListNeutral: string[] = devicesIcons['neutral'];
  iconListErrors: string[] = devicesIcons['error'];
  status: string = "";
  unit: string = "";

  apiStatus: number = 0;

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
          this.apiStatus = 0;

          if(!sensor) return;
          this.apiStatus = 1;

          if(sensor.value && (this.sensor.type === "digital" && isNaN(parseFloat(sensor.value))) || (this.sensor.type === "analog" && !isNaN(parseFloat(sensor.value)))) {
            this.status = sensor.value.toLowerCase();
            this.unit = sensor.unit;
            this.apiStatus = 2;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.timer?.unsubscribe();
  }
}
