import {Component, inject, Input, OnInit} from '@angular/core';
import {DeviceInfo} from '../device-info';
import {DeviceCallerService} from '../device-caller.service';
import * as devicesIcons from '../../../devices/icons.json';
import {NgClass, NgForOf} from '@angular/common';
@Component({
  selector: 'app-sensor-view',
  imports: [
    NgClass
  ],
  templateUrl: './sensor-view.component.html',
  styleUrl: './sensor-view.component.css'
})
export class SensorViewComponent implements OnInit {
  @Input() sensor!: DeviceInfo;

  deviceCaller = inject(DeviceCallerService)

  iconListOn: string[] = devicesIcons['switch_on'];
  iconListOff: string[] = devicesIcons['switch_off'];
  iconListNeutral: string[] = devicesIcons['neutral'];
  status: string = "";
  unit: string = "";

  ngOnInit(): void {
    this.deviceCaller.getSensor(this.sensor!.endpoint).subscribe(sensor => {
      this.status = sensor.value;
      this.unit = sensor.unit;
    })
  }
}
