import {inject, Injectable, signal} from '@angular/core';
import {Firestore, collection, collectionData, addDoc, getDocs, doc, getDoc} from '@angular/fire/firestore'
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, user } from '@angular/fire/auth'
import {from, Observable} from 'rxjs';
import {User} from './user';
import {DeviceInfo} from './device-info';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore = inject(Firestore)
  auth = inject(Auth);

  userObservable = user(this.auth);
  userSignal = signal<User | undefined | null>(undefined)

  register(email: string, username:string, password: string): Observable<any> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password);
    promise.then(response => { updateProfile(response.user, {displayName: username}).then(() => {})  })
    return from(promise);
  }

  login(email: string, password: string): Observable<any> {
    const promise = signInWithEmailAndPassword(this.auth, email, password);
    promise.then(response => {})
    return from(promise);
  }

  loginWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.auth, provider);
    promise.then(response => { })
    return from(promise);
  }

  signOut(): Observable<any> {
    const promise = this.auth.signOut();
    return from(promise);
  }

  devices = collection(this.firestore, 'devices');
  sensors = collection(this.firestore, 'sensors');

  async getDevices(): Promise<DeviceInfo[]> {
    const userDocRef = doc(this.firestore, `devices/${this.userSignal()?.email}`);
    return getDoc(userDocRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data['devices'] || [];
      } else {
        console.warn('No such document!');
        return [];
      }
    });
  }

  async getSensors(): Promise<DeviceInfo[]> {
    const userDocRef = doc(this.firestore, `devices/${this.userSignal()?.email}`);
    return getDoc(userDocRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data['sensors'] || [];
      } else {
        console.warn('No such document!');
        return [];
      }
    });
  }
}
