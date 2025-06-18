import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FirebaseService} from '../firebase.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-side-bar',
  imports: [
    RouterLink,
    NgClass,
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  firebaseService = inject(FirebaseService);
  router: Router = inject(Router);
}
