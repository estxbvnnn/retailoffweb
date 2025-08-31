import { Injectable } from '@angular/core';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, deleteUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  uid: string;
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private app = getApps().length ? getApp() : initializeApp(environment.firebase);
  private auth = getAuth(this.app);
  private db = getFirestore(this.app);

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (u) => this.userSubject.next(u));
  }

  // Nuevo: espera a que auth tenga al usuario con el uid indicado
  private async waitForAuthUser(uid: string, timeoutMs = 3000): Promise<void> {
    if (this.auth.currentUser?.uid === uid) return;
    await new Promise<void>((resolve) => {
      const off = onAuthStateChanged(this.auth, (u) => {
        if (u?.uid === uid) {
          off();
          resolve();
        }
      });
      setTimeout(() => {
        off();
        resolve();
      }, timeoutMs);
    });
  }

  // Nuevo: setDoc con reintentos (backoff simple)
  private async setDocWithRetry(pathUid: string, data: UserProfile, attempts = 3): Promise<void> {
    let lastErr: any;
    for (let i = 0; i < attempts; i++) {
      try {
        await setDoc(doc(this.db, 'usuarios', pathUid), data, { merge: true });
        return;
      } catch (e: any) {
        lastErr = e;
        console.error('[Firestore] setDoc usuarios/%s intento %d falló:', pathUid, i + 1, e);
        // Si es permisos, no sirve reintentar
        if (e?.code === 'permission-denied') throw e;
        await new Promise(r => setTimeout(r, 200 * (i + 1)));
      }
    }
    throw lastErr;
  }

  async registerWithProfile(
    profile: Omit<UserProfile, 'uid' | 'createdAt' | 'email'> & { email: string },
    password: string
  ) {
    const cred = await createUserWithEmailAndPassword(this.auth, profile.email, password);
    const uid = cred.user.uid;
    const data: UserProfile = {
      uid,
      email: profile.email,
      rut: profile.rut,
      nombre: profile.nombre,
      apellido: profile.apellido,
      telefono: profile.telefono,
      createdAt: Date.now(),
    };

    try {
      // Esperar a que Auth quede con el usuario activo y escribir en usuarios/{uid}
      await this.waitForAuthUser(uid);
      await this.setDocWithRetry(uid, data);
      // Verificación opcional (no bloqueante)
      try { await getDoc(doc(this.db, 'usuarios', uid)); } catch (e) {
        console.warn('[Firestore] verificación de doc omitida/fallida:', e);
      }
      return cred;
    } catch (e) {
      console.error('[Registro] Falló guardar perfil, se eliminará el usuario creado:', e);
      // Si falló el guardado del perfil, eliminamos el usuario para evitar "email ya registrado" en reintento
      try { await deleteUser(cred.user); } catch (delErr) {
        console.warn('[Registro] No se pudo eliminar el usuario tras fallo de perfil:', delErr);
      }
      const err: any = new Error('profile-write-failed');
      err.code = 'profile-write-failed';
      throw err;
    }
  }

  async getUserProfile(uid: string) {
    const snap = await getDoc(doc(this.db, 'usuarios', uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  async updateUserProfile(uid: string, patch: Partial<UserProfile>) {
    await setDoc(doc(this.db, 'usuarios', uid), patch, { merge: true });
  }
}
