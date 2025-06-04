import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FirebaseService} from '../firebase.service';

@Component({
  selector: 'app-side-bar',
  imports: [
    RouterLink
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  router = inject(Router);
  firebaseService = inject(FirebaseService);
  signOut(): void {
    this.firebaseService.signOut().then(() => {
      this.router.navigateByUrl('/login');
    })
  }
}
