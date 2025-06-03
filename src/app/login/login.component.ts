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
  errorMessage: string | null = null;

  login(): void {
    this.firebaseService.login(this.loginForm.value.email!, this.loginForm.value.password!)
      .subscribe({
        next: result => {
          this.errorMessage = null;
          this.router.navigateByUrl('/')
        },
        error: error => {
          this.errorMessage = error.code;
        }
      })
  }

  google(): void {
    this.firebaseService.loginWithGoogle()
      .subscribe({
        next: result => {
          this.errorMessage = null;
          this.router.navigateByUrl('/')
        },
        error: error => {
          this.errorMessage = error.code;
        }
      })
  }
}
