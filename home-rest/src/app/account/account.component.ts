import {Component, effect, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FirebaseService} from '../firebase.service';
import {NgIf} from '@angular/common';
import {
  AbstractControl, AsyncValidatorFn,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {map, Observable, of} from 'rxjs';

@Component({
  selector: 'app-account',
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  router = inject(Router);
  firebaseService = inject(FirebaseService);
  updateForm: FormGroup | undefined;

  usernameValidator = (): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const typedUsername = control.value;
      const currentUsername = this.firebaseService.userSignal()?.displayName;

      if (!typedUsername) return of(null);

      return of(typedUsername === currentUsername).pipe(
        map(sameUsername => sameUsername ? { sameUsername: true } : null)
      );
    };
  };

  ngOnInit(): void {
    this.updateForm = new FormGroup({
      username: new FormControl(this.firebaseService.userSignal()?.displayName, [], [this.usernameValidator()])
    })
  }

  logout(): void {
    this.firebaseService.signOut().then(() => {
      this.router.navigateByUrl('/login');
    })
  }

  update(){
    this.firebaseService.updateUsername(this.updateForm!.value.username).then(_ => {
      this.updateForm?.get('username')?.updateValueAndValidity();
    });
  }
}
