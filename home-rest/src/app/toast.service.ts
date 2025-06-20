import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<string>();
  toast$ = this.toastSubject.asObservable();

  show(message: string) {
    this.toastSubject.next(message);
  }
}

export function getDeviceFontClass(name: string): string {
  if (name.length > 10) return 'fs-6';
  return 'fs-5';
}
