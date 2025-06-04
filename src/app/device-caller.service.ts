import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DeviceResponse} from './device-response';
import {SensorResponse} from './sensor-response';

@Injectable({
  providedIn: 'root'
})
export class DeviceCallerService {
  httpClient: HttpClient = inject(HttpClient);

  getDevice(url: string): Observable<DeviceResponse> {
    return this.httpClient.get<DeviceResponse>(url);
  }

  getSensor(url: string): Observable<SensorResponse> {
    return this.httpClient.get<SensorResponse>(url);
  }

  postDevice(url: string, action: string): Observable<DeviceResponse> {
    return this.httpClient.post<DeviceResponse>(url, {action: action}, {headers: {'Content-Type': 'application/json'}});
  }
}
