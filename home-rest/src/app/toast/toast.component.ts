import {Component, inject, Input, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {ToastService} from '../toast.service';

@Component({
  selector: 'app-toast',
  imports: [
    NgIf
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit {
  message = '';
  toastService: ToastService = inject(ToastService);

  ngOnInit(): void {
    this.toastService.toast$.subscribe(msg => {
      this.message = msg;
    });
  }

  close() {
    this.message = '';
  }
}
