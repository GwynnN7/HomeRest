import {Component, inject} from '@angular/core';
import {FirebaseService} from '../firebase.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-registration',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  firebaseService = inject(FirebaseService);
  router = inject(Router);

  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('',  [Validators.required]),
    password: new FormControl('', [Validators.required])
  })
  errorMessage: string | null = null;
  register(): void {
    this.firebaseService.register(this.registrationForm.value.email!, this.registrationForm.value.username!, this.registrationForm.value.password!)
      .subscribe({
        next: result => {
          this.errorMessage = null;
          this.router.navigateByUrl('/');
        },
        error: error => {
          this.errorMessage = error.code;
        }
      })
  }
}
