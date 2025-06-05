import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfo} from '../device-info';
import {DeviceCallerService} from '../device-caller.service';
import * as devicesIcons from '../../../devices/icons.json';
import {NgClass, NgForOf} from '@angular/common';
import {interval, startWith, Subscription, switchMap} from 'rxjs';
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
  status: string = "";
  unit: string = "";

  ngOnInit(): void {
    this.timer = interval(2000)
      .pipe(
        startWith(0),
        switchMap(() => this.deviceCaller.getSensor(this.sensor!.endpoint))
      )
      .subscribe(sensor => {
        this.status = sensor.value;
        this.unit = sensor.unit;
      });
  }

  ngOnDestroy(): void {
    this.timer?.unsubscribe();
  }
}
