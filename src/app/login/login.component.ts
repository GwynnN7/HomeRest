import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FirebaseService} from '../firebase.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  firebaseService = inject(FirebaseService);
  router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  login(): void {
    this.firebaseService.login(this.loginForm.value.email!, this.loginForm.value.password!)
      .then(_ => {
        this.router.navigateByUrl('/');
      }).catch(error => {
          alert(error.code);
    });
  }

  google(): void {
    this.firebaseService.loginWithGoogle()
      .then(_ => {
        this.router.navigateByUrl("/devices");
      }).catch(error => {
          alert(error.code);
    });
  }
}
