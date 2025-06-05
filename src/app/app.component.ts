import {Component, inject, OnInit} from '@angular/core';
import {FirebaseService} from './firebase.service';
import {SideBarComponent} from './side-bar/side-bar.component';
import {NavigationStart, Router, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [SideBarComponent, RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  firebaseService = inject(FirebaseService);
  router: Router = inject(Router);
  modalService: NgbModal = inject(NgbModal);
  isOnline = navigator.onLine;

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.modalService.dismissAll(); // dismiss all modals on route change
      }
    });
    window.addEventListener('online', () => {
      if(this.router.url.includes('offline')) {
        this.router.navigateByUrl('/');
      }
    });

    window.addEventListener('offline', () => {
      if(!this.router.url.includes('offline')) {
        this.router.navigateByUrl('/offline');
      }
    });

    this.firebaseService.updateUser();
  }
}
