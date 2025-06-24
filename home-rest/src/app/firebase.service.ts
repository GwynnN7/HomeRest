import {computed, inject, Injectable, signal} from '@angular/core';
import {Firestore, doc, getDoc, setDoc, docData, deleteDoc} from '@angular/fire/firestore'
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  user,
  User,
  deleteUser
} from '@angular/fire/auth'
import {catchError, map, Observable, of} from 'rxjs';
import {DeviceInfo} from './device-info';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore = inject(Firestore)
  auth = inject(Auth);

  userObservable = user(this.auth);
  userSignal = signal<User | undefined>(undefined)

  updateUser() {
    this.userObservable.subscribe(user => {
      this.updateUserSignal(user);
    });
  }

  private updateUserSignal(user: User | null) {
    if (user) {
      this.userSignal.set(user);

      caches.open('auth-cache').then(async cache => {
        await cache.put('/uid', new Response(user.uid))
      });
    }
    else{
      this.userSignal.set(undefined);

      caches.open('auth-cache').then(async cache => {
        await cache.delete('/uid')
      });
    }
  }

  async register(email: string, username: string, password: string): Promise<any> {
    const user = await createUserWithEmailAndPassword(this.auth, email, password);
    await setDoc(doc(this.firestore, "devices", user.user.uid), {"devices":[], "sensors": []});
    await this.updateUsername(username);
  }

  async login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle(): Promise<any> {
    return signInWithPopup(this.auth,  new GoogleAuthProvider).then(user => {
      const devicesDoc = doc(this.firestore, "devices", user.user.uid);
      getDoc(devicesDoc).then((doc) => {
        if (doc.exists()) return;
        setDoc(devicesDoc, {"devices": [], "sensors": []})
      });
    });
  }

  async updateUsername(username: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;

    await updateProfile(user, { displayName: username });
    await user.reload();

    this.userSignal.set(this.auth.currentUser!);
  }

  signOut(): Promise<any> {
    return this.auth.signOut();
  }

  async deleteAccount(): Promise<void> {
    const user = this.userSignal();
    if (!user) return Promise.reject();

    const devicesDoc = doc(this.firestore, "devices", user!.uid);
    await deleteDoc(devicesDoc);
    return await deleteUser(user!);
  }

  readonly userId = computed(() => this.userSignal()?.uid ?? null);

  getDevices(category: string): Observable<DeviceInfo[]> {
    if(!this.userId) return of([]);

    const documentReference = doc(this.firestore, `devices/${this.userId()}`);
    return docData(documentReference).pipe(
      map(docData => (docData && docData[category]) ? docData[category] : []),
      catchError(_ => of([]))
    );
  }

  async addDevice(newDevice: DeviceInfo, category: string, edit: boolean): Promise<boolean> {
    if(!this.userId) return false;

    const documentReference = doc(this.firestore, `devices/${this.userId()}`);
    return getDoc(documentReference).then((documentSnapshot) => {
      if (!documentSnapshot.exists()) return false;

      const data = documentSnapshot.data();
      const index = data[category].findIndex((device: DeviceInfo) => device.id === newDevice.id);
      if(index != -1 && data[category].length > 0)
      {
        if(!edit) return false;
        data[category][index] = newDevice;
      }
      else data[category].push(newDevice);
      return setDoc(documentReference, data)
        .then(_ => true)
        .catch(_ => false)

    }).catch(_ => false)
  }

  async deleteDevice(selectedDevice: DeviceInfo, category: string): Promise<boolean> {
    if (!this.userId) return false;

    const documentReference = doc(this.firestore, `devices/${this.userId()}`);
    return getDoc(documentReference).then((documentSnapshot) => {
      if (!documentSnapshot.exists()) return false;

      const data = documentSnapshot.data();
      const newData = data[category].filter((device: DeviceInfo) => device.id !== selectedDevice.id);
      if (newData.length === data[category].length) return false;
      data[category] = newData;
      return setDoc(documentReference, data)
        .then(_ => true)
        .catch(_ => false);

    }).catch(_ => false);
  }
}

export function getFirebaseAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is invalid';
    case 'auth/user-disabled':
      return 'This user account has been disabled';
    case 'auth/user-not-found':
      return 'User with this email not found';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'This email is already in use';
    case 'auth/weak-password':
      return 'The password is too weak, choose a better one';
    case 'auth/account-exists-with-different-credential':
      return 'This account is linked to a different sign-in method.';
    case 'auth/credential-already-in-use':
      return 'This credential is already in use';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by the browser';
    case 'auth/popup-closed-by-user':
      return 'You closed the popup before finishing the sign-in';
    case 'auth/invalid-credential':
      return 'The authentication credential is not valid';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts, try again later';
    case 'auth/network-request-failed':
      return 'A network error occurred, check your connection.';
    default:
      return 'An error occurred, please try again';
  }
}
