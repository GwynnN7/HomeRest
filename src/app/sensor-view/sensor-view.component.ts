import {Component, inject, Input, OnChanges, OnInit} from '@angular/core';
import {DeviceInfo} from '../device-info';
import {DeviceCallerService} from '../device-caller.service';

@Component({
  selector: 'app-sensor-view',
  imports: [],
  templateUrl: './sensor-view.component.html',
  styleUrl: './sensor-view.component.css'
})
export class SensorViewComponent implements OnChanges {
  @Input() sensor: DeviceInfo | undefined;
  deviceCaller = inject(DeviceCallerService)

  value: string = "";

  ngOnChanges(): void {
    this.deviceCaller.getSensor(this.sensor!.endpoint).subscribe(device => {
      this.value = `${device.sensor}: ${device.value}${device.unit}`;
    })
  }

  editSensor(id: string) {

  }
}
