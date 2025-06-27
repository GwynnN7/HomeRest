import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FirebaseService, getFirebaseErrorText} from '../firebase.service';
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
  private toastService: ToastService = inject(ToastService);
  private router = inject(Router);
  firebaseService = inject(FirebaseService);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  login(): void {
    this.firebaseService.login(this.loginForm.value.email!, this.loginForm.value.password!)
      .then(_ => {
        this.router.navigateByUrl('/');
      }).catch(error => {
      this.toastService.show(getFirebaseErrorText(error.code));
    });
  }

  google(): void {
    this.firebaseService.loginWithGoogle()
      .then(_ => {
        this.router.navigateByUrl('/');
      }).catch(error => {
        this.toastService.show(getFirebaseErrorText(error.code));
    });
  }
}
