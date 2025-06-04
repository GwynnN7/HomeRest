import {Component, inject, Input, OnInit} from '@angular/core';
import {DeviceInfo} from '../device-info';
import {DeviceCallerService} from '../device-caller.service';
import {NgClass, NgForOf} from '@angular/common';
import * as devicesIcons from '../../../devices/icons.json'

@Component({
  selector: 'app-device-view',
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: './device-view.component.html',
  styleUrl: './device-view.component.css'
})
export class DeviceViewComponent implements OnInit{
  @Input() device: DeviceInfo | undefined;

  deviceCaller = inject(DeviceCallerService)

  iconListOn: string[] = devicesIcons['switch_on'];
  iconListOff: string[] = devicesIcons['switch_off'];
  iconListNeutral: string[] = devicesIcons['neutral'];
  status: string = "";

  ngOnInit(): void {
    this.deviceCaller.getDevice(this.device!.endpoint).subscribe(device => {
      this.status = device.status;
    })
  }

  callDeviceEndpoint(action: string, $event: MouseEvent): void {
    this.deviceCaller.postDevice(this.device!.endpoint, action).subscribe(device => {
      this.status = device.status;
    })
    $event.stopPropagation();
  }
}
