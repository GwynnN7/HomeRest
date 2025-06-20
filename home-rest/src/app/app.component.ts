import {Component, inject, OnInit} from '@angular/core';
import {FirebaseService} from './firebase.service';
import {SideBarComponent} from './side-bar/side-bar.component';
import {NavigationStart, Router, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationService} from './notification.service';
import {ToastComponent} from './toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [SideBarComponent, RouterOutlet, NgIf, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  firebaseService: FirebaseService = inject(FirebaseService);
  notificationService: NotificationService = inject(NotificationService)
  router: Router = inject(Router);
  modalService: NgbModal = inject(NgbModal);
  isOnline = navigator.onLine;

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.modalService.dismissAll();
      }
    });
    window.addEventListener('online', () => {
      if(this.router.url.includes('offline')) {
        this.router.navigateByUrl('/');
        this.isOnline = true;
      }
    });

    window.addEventListener('offline', () => {
      if(!this.router.url.includes('offline')) {
        this.router.navigateByUrl('/offline');
        this.isOnline = false;
      }
    });

    this.firebaseService.updateUser();

    this.notificationService.requestPermission();
  }
}
