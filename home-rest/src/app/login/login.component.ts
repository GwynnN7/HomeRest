import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FirebaseService, getFirebaseAuthErrorMessage} from '../firebase.service';
import {Router} from '@angular/router';
import {ToastService} from '../toast.service';

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
  toastService: ToastService = inject(ToastService);
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
      this.toastService.show(getFirebaseAuthErrorMessage(error.code));
    });
  }

  google(): void {
    this.firebaseService.loginWithGoogle()
      .then(_ => {
        this.router.navigateByUrl('/');
      }).catch(error => {
        this.toastService.show(getFirebaseAuthErrorMessage(error.code));
    });
  }
}
