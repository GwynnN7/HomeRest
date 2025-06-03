import {Component, inject, Input, OnChanges, OnInit} from '@angular/core';
import {DeviceInfo} from '../device-info';
import {DeviceCallerService} from '../device-caller.service';
@Component({
  selector: 'app-device-view',
  imports: [],
  templateUrl: './device-view.component.html',
  styleUrl: './device-view.component.css'
})
export class DeviceViewComponent implements OnChanges{
  @Input() device: DeviceInfo | undefined;
  deviceCaller = inject(DeviceCallerService)

  status: string = "";

  ngOnChanges(): void {
    this.deviceCaller.getDevice(this.device!.endpoint).subscribe(device => {
      this.status = `${device.device} is ${device.status}`;
    })
  }

  editDevice(id: string) {

  }
}
