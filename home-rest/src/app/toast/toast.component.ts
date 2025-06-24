import {Component, inject,  OnDestroy, OnInit} from '@angular/core';
import { NgClass } from '@angular/common';
import {ToastService} from '../toast.service';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  imports: [
    NgClass
],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  message = '';
  color = 'bg-danger';
  timer?: Subscription;
  toastService: ToastService = inject(ToastService);

  ngOnInit(): void {
    this.toastService.toastObservable.subscribe(msg => {
      this.cancelTimer()
      this.message = msg.message;
      this.color = msg.color;
      this.startTimer()
    });
  }

  close() {
    this.message = '';
  }

  startTimer() {
    this.timer = timer(2000).subscribe(() => {
      this.close()
    });
  }

  cancelTimer() {
    this.timer?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.cancelTimer();
  }
}
