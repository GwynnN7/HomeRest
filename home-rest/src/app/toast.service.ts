import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toastObservable = this.toastSubject.asObservable();

  show(message: string, color: string = "bg-danger") {
    this.toastSubject.next(new ToastMessage(message, color));
  }

  dismiss(){
    this.show("");
  }
}

export class ToastMessage {
  message: string;
  color: string;

  constructor(message: string, color: string) {
    this.message = message;
    this.color = color;
  }
}
