import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {lastValueFrom, Observable} from 'rxjs';
import {DeviceResponse} from './device-response';
import {SensorResponse} from './sensor-response';
import {environment} from '../environments/environment';
import {SwPush} from '@angular/service-worker';
import {FirebaseService} from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceCallerService {
  httpClient: HttpClient = inject(HttpClient);
  swPush: SwPush = inject(SwPush);
  firebaseService: FirebaseService = inject(FirebaseService);

  getDevice(url: string): Observable<DeviceResponse> {
    return this.httpClient.get<DeviceResponse>(url);
  }

  getSensor(url: string): Observable<SensorResponse> {
    return this.httpClient.get<SensorResponse>(url);
  }

  postDevice(url: string, action: string): Observable<DeviceResponse> {
    return this.httpClient.post<DeviceResponse>(url, {action: action}, {headers: {'Content-Type': 'application/json'}});
  }

  async subscribeDevice(url: string, subscribe: string) {
    const sub = await this.swPush.requestSubscription({
      serverPublicKey: environment.push.publicKey,
    });
    return lastValueFrom(this.httpClient.post(`${url}/${subscribe}`, {subscription: sub, uid: this.firebaseService.userSignal()?.uid}));
  }
}

export enum ApiResponse{
  Offline,
  Unknown,
  Online
}
