import {Component, inject} from '@angular/core';
import {FirebaseService, getFirebaseErrorText} from '../firebase.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../toast.service';

@Component({
  selector: 'app-registration',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  private toastService: ToastService = inject(ToastService);
  private router = inject(Router);
  firebaseService = inject(FirebaseService);

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
        this.toastService.show(getFirebaseErrorText(error.code));
    });
  }
}
