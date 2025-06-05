import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FirebaseService} from '../firebase.service';

@Component({
  selector: 'app-side-bar',
  imports: [
    RouterLink,
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  firebaseService = inject(FirebaseService);
}
