import {Component, inject, OnInit} from '@angular/core';
import {FirebaseService} from './firebase.service';
import {SideBarComponent} from './side-bar/side-bar.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [SideBarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  firebaseService = inject(FirebaseService);
  ngOnInit(): void {
    this.firebaseService.userObservable.subscribe(user => {
      if (user) {
        this.firebaseService.userSignal.set({
          uid: user.uid!,
          email: user.email!,
          username: user.displayName ?? ''
        });
      }
      else{
        this.firebaseService.userSignal.set(undefined);
      }
    });
  }
}
