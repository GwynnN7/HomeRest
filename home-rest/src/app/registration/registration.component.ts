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
    username: new FormControl(''),
    password: new FormControl('', [Validators.required])
  })

  register(): void {
    this.firebaseService.register(this.registrationForm.value.email!, this.registrationForm.value.username!, this.registrationForm.value.password!)
      .then(_ => {
        this.router.navigateByUrl('/');
      })
      .catch(error => {
        alert(error.code);
    });
  }
}
