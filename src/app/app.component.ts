import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {FirebaseService} from './firebase.service';
import {SideBarComponent} from './side-bar/side-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'home-rest';
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  ngOnInit(): void {
    this.firebaseService.userObservable.subscribe(user => {
      if (user) {
        this.firebaseService.userSignal.set({
          email: user.email!,
          username: user.displayName!,
        })
        this.router.navigateByUrl('/')
      }
      else{
        this.firebaseService.userSignal.set(null)
      }
    })
  }
}
