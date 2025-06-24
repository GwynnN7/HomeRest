import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfo, getDeviceFontClass} from '../device-info';
import {ApiResponse, DeviceCallerService} from '../device-caller.service';
import { NgClass } from '@angular/common';
import {catchError, interval, of, startWith, Subscription, switchMap} from 'rxjs';
import {DeviceResponse} from '../device-response';
import * as devicesIcons from '../../icons.json'

@Component({
  selector: 'app-device-view',
  imports: [
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
  apiStatus: ApiResponse = ApiResponse.Offline;

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
        next: device => this.updateStatus(device)
      });
  }

  updateStatus(device: DeviceResponse | null) {
    this.status = '';
    this.apiStatus = ApiResponse.Offline;

    if(!device) return;
    this.apiStatus = ApiResponse.Unknown;

    if(device.status && (this.device.type === "digital" && isNaN(parseFloat(device.status))) || (this.device.type === "analog" && !isNaN(parseFloat(device.status)))) {
      this.status = device.status.toLowerCase();
      this.apiStatus = ApiResponse.Online;
    }
  }

  ngOnDestroy(): void {
    this.timer?.unsubscribe();
  }

  callDeviceEndpoint(action: string, event: MouseEvent): void {
    this.deviceCaller.postDevice(this.device!.endpoint, action).subscribe(device => {
      this.updateStatus(device);
    })
    event.stopPropagation();
  }

  protected readonly ApiResponse = ApiResponse;
  protected readonly getDeviceFontClass = getDeviceFontClass;
}
