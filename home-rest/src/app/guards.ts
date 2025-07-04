import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);

  return firebaseService.userObservable.pipe(
    map(user => {
      if (user) return true;
      router.navigateByUrl('/login');
      return false;
    })
  );
};

export const noAuthGuard: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);

  return firebaseService.userObservable.pipe(
    map(user => {
      if (user) {
        router.navigateByUrl('/');
        return false;
      }
      return true;
    })
  );
};

export const offlineGuard: CanActivateFn = (route, state) => {
  return !navigator.onLine
};

export const onlineGuard: CanActivateFn = (route, state) => {
  return navigator.onLine
};
