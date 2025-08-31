import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput,
  IonButton, IonList, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput,
    IonButton, IonList, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg
  ],
  styles: [`
    .card { max-width: 420px; margin: 24px auto; }
    .logo { width: 120px; height: auto; margin: 12px auto 8px; display:block; }
    .brand { text-align: center; margin-bottom: 8px; color: var(--ion-color-danger); }
    .auth-bg { min-height: 100%; background: linear-gradient(180deg,#0a0a0a,#111); }
    .dark-card { background:#161616; border:1px solid #272727; color:#fff; }
    ion-item[color="dark"] { --background:#0f0f0f; --color:#fff; --border-color:#2a2a2a; }
  `],
  template: `
  <ion-header>
    <ion-toolbar color="dark">
      <ion-title>RetailOff</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding auth-bg">
    <ion-card class="card dark-card">
      <ion-card-header>
        <ion-img class="logo" src="/assets/img/logo.png" alt="RetailOff"></ion-img>
        <ion-card-title class="brand">Inicio de sesión</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item fill="outline" color="dark">
            <ion-label position="stacked">Correo</ion-label>
            <ion-input type="email" [(ngModel)]="email"></ion-input>
          </ion-item>
          <ion-item fill="outline" color="dark">
            <ion-label position="stacked">Contraseña</ion-label>
            <ion-input type="password" [(ngModel)]="password"></ion-input>
          </ion-item>
        </ion-list>

        <ion-button expand="block" color="danger" class="ion-margin-top" (click)="login()">Entrar</ion-button>
        <div class="ion-text-center ion-margin-top">
          <ion-text color="medium">¿No tienes cuenta?</ion-text>
          <ion-button fill="clear" color="danger" [routerLink]="['/register']">Registrarme</ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  </ion-content>
  `
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastController);

  email = '';
  password = '';

  async login() {
    try {
      if (!this.email || !this.password) throw new Error('complete');
      const cred = await this.auth.login(this.email, this.password);
      // Opcional: leer perfil en "usuarios"
      try { await this.auth.getUserProfile(cred.user.uid); } catch {}
      const t = await this.toast.create({ message: 'Bienvenido', duration: 1000, color: 'success' });
      await t.present();
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (e: any) {
      const msg = e?.code?.includes('invalid-credential') ? 'Correo o contraseña incorrectos' : 'Completa los campos correctamente';
      (await this.toast.create({ message: msg, duration: 1500, color: 'danger' })).present();
    }
  }
}
