import {Component, inject, OnInit} from '@angular/core';
import {FirebaseService} from './firebase.service';
import {SideBarComponent} from './side-bar/side-bar.component';
import {NavigationStart, Router, RouterOutlet} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastComponent} from './toast/toast.component';
import {ToastService} from './toast.service';

@Component({
  selector: 'app-root',
  imports: [SideBarComponent, RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  firebaseService: FirebaseService = inject(FirebaseService);

  router: Router = inject(Router);
  modalService: NgbModal = inject(NgbModal);
  toastService: ToastService = inject(ToastService);
  isOnline = navigator.onLine;

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.modalService.dismissAll();
        this.toastService.dismiss();
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

    this.requestPermission();
  }

  requestPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Permission granted for notifications.');
        }
      });
    }
  }
}
