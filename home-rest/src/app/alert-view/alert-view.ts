import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfo, getDeviceFontClass} from '../device-info';
import {ApiResponse, DeviceCallerService} from '../device-caller.service';
import {NgClass} from '@angular/common';
import {catchError, interval, of, startWith, Subscription, switchMap} from 'rxjs';
import {DeviceResponse} from '../device-response';
import {ToastService} from '../toast.service';
import * as devicesIcons from '../../icons.json'

@Component({
  selector: 'app-alert',
  imports: [
    NgClass
  ],
  templateUrl: './alert-view.html',
  styleUrl: './alert-view.css'
})
export class AlertView implements OnInit, OnDestroy{
  @Input() alert!: DeviceInfo;

  deviceCaller = inject(DeviceCallerService)
  toastService: ToastService = inject(ToastService);
  private timer?: Subscription;

  iconListOn: string[] = devicesIcons['switch_on'];
  iconListNeutral: string[] = devicesIcons['neutral'];
  iconListErrors: string[] = devicesIcons['error'];

  apiStatus: ApiResponse = ApiResponse.Offline;

  ngOnInit(): void {
    this.timer = interval(2000)
      .pipe(
        startWith(0),
        switchMap(() => this.deviceCaller.getDevice(this.alert!.endpoint).pipe(
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
    this.apiStatus = device ? ApiResponse.Online : ApiResponse.Offline;
  }

  ngOnDestroy(): void {
    this.timer?.unsubscribe();
  }

  subscribe(sub: boolean, event: MouseEvent) {
    const param = sub ? "subscribe" : "unsubscribe";
    this.deviceCaller.subscribeDevice(this.alert.endpoint, param)
      .then(_ => {
        this.toastService.show(`Device successfully ${param}d `, "bg-success");
       })
      .catch(_ =>
      this.toastService.show(`Could not ${param} this device`)
    );
    event.stopPropagation();
  }

  protected readonly ApiResponse = ApiResponse;
  protected readonly getDeviceFontClass = getDeviceFontClass;
}
