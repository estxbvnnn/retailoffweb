import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput,
  IonButton, IonList, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

function cleanRut(rut: string) { return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase(); }
function validarRut(rut: string): boolean {
  const r = cleanRut(rut);
  if (!/^\d{7,8}[0-9K]$/.test(r)) return false;
  const cuerpo = r.slice(0, -1), dv = r.slice(-1);
  let suma = 0, mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) { suma += parseInt(cuerpo[i], 10) * mult; mult = mult === 7 ? 2 : mult + 1; }
  const res = 11 - (suma % 11); const dvCalc = res === 11 ? '0' : res === 10 ? 'K' : String(res);
  return dv === dvCalc;
}
function validarPass(pass: string) { return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,16}$/.test(pass); }

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput,
    IonButton, IonList, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg
  ],
  styles: [`
    .card { max-width: 480px; margin: 24px auto; }
    .logo{ width: 110px; display:block; margin: 8px auto; }
    .auth-bg { min-height: 100%; background: linear-gradient(180deg,#0a0a0a,#111); }
    .dark-card { background:#161616; border:1px solid #272727; color:#fff; }
    ion-item[color="dark"] { --background:#0f0f0f; --color:#fff; --border-color:#2a2a2a; }
    ion-label { color: var(--ion-color-light-contrast); }
  `],
  template: `
  <ion-header>
    <ion-toolbar color="dark">
      <ion-title>Registro</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding auth-bg">
    <ion-card class="card dark-card">
      <ion-card-header>
        <ion-img class="logo" src="/assets/img/logo.png" alt="RetailOff"></ion-img>
        <ion-card-title>Crear cuenta</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <form #f="ngForm" (ngSubmit)="register(f)" novalidate>
          <ion-list>
            <ion-item fill="outline" color="dark">
              <ion-label position="stacked">RUT</ion-label>
              <ion-input [(ngModel)]="rut" name="rut" required></ion-input>
            </ion-item>
            <ion-text color="danger" *ngIf="rut && !isRutValid()">RUT inválido</ion-text>

            <ion-item fill="outline" color="dark">
              <ion-label position="stacked">Nombre</ion-label>
              <ion-input [(ngModel)]="nombre" name="nombre" required></ion-input>
            </ion-item>

            <ion-item fill="outline" color="dark">
              <ion-label position="stacked">Apellido</ion-label>
              <ion-input [(ngModel)]="apellido" name="apellido" required></ion-input>
            </ion-item>

            <ion-item fill="outline" color="dark">
              <ion-label position="stacked">Correo</ion-label>
              <ion-input type="email" [(ngModel)]="email" name="email" required></ion-input>
            </ion-item>

            <ion-item fill="outline" color="dark">
              <ion-label position="stacked">Teléfono</ion-label>
              <ion-input type="tel" [(ngModel)]="telefono" name="telefono" required></ion-input>
            </ion-item>

            <ion-item fill="outline" color="dark">
              <ion-label position="stacked">Contraseña</ion-label>
              <ion-input type="password" [(ngModel)]="password" name="password" required></ion-input>
            </ion-item>
            <ion-text color="medium">
              Mínimo 6 y máximo 16, al menos 1 mayúscula y 1 carácter especial.
            </ion-text>
            <ion-text color="danger" *ngIf="password && !isPassValid()">Contraseña no cumple requisitos</ion-text>
          </ion-list>

          <ion-button
            expand="block"
            color="danger"
            class="ion-margin-top"
            type="submit"
            [disabled]="submitting || !f.valid || !isRutValid() || !isPassValid()">
            {{ submitting ? 'Procesando...' : 'Registrar' }}
          </ion-button>
          <ion-button expand="block" fill="clear" [routerLink]="['/login']">Ir a Login</ion-button>
        </form>
      </ion-card-content>
    </ion-card>
  </ion-content>
  `
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastController);

  rut = ''; nombre = ''; apellido = ''; email = ''; telefono = ''; password = '';
  submitting = false;

  isRutValid() { return validarRut(this.rut); }
  isPassValid() { return validarPass(this.password); }

  async register(f: NgForm) {
    try {
      if (this.submitting) return;
      if (!f.valid || !this.isRutValid() || !this.isPassValid()) {
        (await this.toast.create({ message: 'Corrige los campos marcados', duration: 1500, color: 'danger' })).present();
        return;
      }
      this.submitting = true;
      await this.auth.registerWithProfile(
        { rut: cleanRut(this.rut), nombre: this.nombre.trim(), apellido: this.apellido.trim(), telefono: this.telefono.trim(), email: this.email.trim() },
        this.password
      );
      (await this.toast.create({ message: 'Registro exitoso', duration: 1200, color: 'success' })).present();
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (e: any) {
      const code = e?.code || '';
      let msg = 'Error al registrar';
      if (code.includes('profile-write-failed')) msg = 'No se pudo guardar tu perfil. Intenta nuevamente.';
      else if (code.includes('email-already-in-use')) msg = 'El correo ya está registrado';
      else if (code.includes('weak-password')) msg = 'La contraseña no cumple los requisitos';
      else if (code.includes('invalid-email')) msg = 'Correo inválido';
      (await this.toast.create({ message: msg, duration: 1600, color: 'danger' })).present();
    } finally {
      this.submitting = false;
    }
  }
}
