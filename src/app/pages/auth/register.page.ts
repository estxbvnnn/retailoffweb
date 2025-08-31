import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput,
  IonButton, IonList, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonList, IonText,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon],
  template: `
    <ion-header><ion-toolbar><ion-title>Registro</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title color="danger">Crear cuenta</ion-card-title>
          <ion-card-subtitle>Completa tus datos</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <form (ngSubmit)="register()">
            <ion-list>
              <ion-item>
                <ion-label position="stacked">RUT Chileno</ion-label>
                <ion-input type="text" [(ngModel)]="rut" name="rut" required maxlength="12" (ionBlur)="rut = formatRut(rut)"></ion-input>
              </ion-item>
              <ion-text color="danger" *ngIf="rut && !validateRut(rut)" style="font-size:13px;">RUT inválido. Ej: 20.349.349-3</ion-text>
              <ion-item>
                <ion-label position="stacked">Nombre</ion-label>
                <ion-input type="text" [(ngModel)]="nombre" name="nombre" required maxlength="30"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Apellido</ion-label>
                <ion-input type="text" [(ngModel)]="apellido" name="apellido" required maxlength="30"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Teléfono (+56)</ion-label>
                <ion-input type="tel" [(ngModel)]="telefono" name="telefono" required maxlength="12"></ion-input>
              </ion-item>
              <ion-text color="danger" *ngIf="telefono && !validateTelefono(telefono)" style="font-size:13px;">Teléfono inválido. Ej: +56912345678</ion-text>
              <ion-item>
                <ion-label position="stacked">Correo</ion-label>
                <ion-input type="email" [(ngModel)]="email" name="email" required maxlength="50"></ion-input>
              </ion-item>
              <ion-text color="danger" *ngIf="email && !validateEmail(email)" style="font-size:13px;">Correo inválido.</ion-text>
              <ion-item>
                <ion-label position="stacked">Contraseña</ion-label>
                <ion-input type="password" [(ngModel)]="password" name="password" required minlength="8" maxlength="16"></ion-input>
              </ion-item>
              <ion-text color="danger" *ngIf="password && !validatePassword(password)" style="font-size:13px;">
                Contraseña inválida. Mínimo 8, máximo 16 caracteres, una mayúscula, un número y un carácter especial.
              </ion-text>
            </ion-list>
            <div class="ion-padding-top">
              <ion-button expand="block" type="submit" [disabled]="!canSubmit()">
                <ion-icon name="person-add-outline" slot="start"></ion-icon>
                Registrarse
              </ion-button>
              <ion-button expand="block" fill="clear" type="button" (click)="goToLogin()">
                <ion-icon name="log-in-outline" slot="start"></ion-icon>
                Ya tengo cuenta
              </ion-button>
            </div>
            <div *ngIf="error" class="ion-padding-top" style="color: var(--ion-color-danger);">
              {{ error }}
            </div>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  rut = '';
  nombre = '';
  apellido = '';
  telefono = '';
  email = '';
  password = '';
  error: string | null = null;

  canSubmit(): boolean {
    return (
      this.validateRut(this.rut) &&
      this.nombre.trim().length > 0 &&
      this.apellido.trim().length > 0 &&
      this.validateTelefono(this.telefono) &&
      this.validateEmail(this.email) &&
      this.validatePassword(this.password)
    );
  }

  async register() {
    this.error = null;
    if (!this.canSubmit()) {
      this.error = 'Completa todos los campos correctamente.';
      return;
    }
    try {
      await this.auth.register(
        this.email.trim(),
        this.password.trim(),
        {
          rut: this.rut.trim(),
          nombre: this.nombre.trim(),
          apellido: this.apellido.trim(),
          telefono: this.telefono.trim()
        }
      );
      this.router.navigate(['/login'], { queryParams: { msg: 'Registro exitoso, por favor inicie sesión.' }, replaceUrl: true });
    } catch (e: any) {
      if (e?.code === 'permission-denied' || e?.message?.includes('permission')) {
        this.error = 'No tienes permisos para registrar usuarios. Contacta al administrador.';
      } else {
        this.error = e?.message || 'No se pudo registrar';
      }
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  // Validaciones
  formatRut(rut: string): string {
    rut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (!rut) return '';
    let body = rut.slice(0, -1);
    let dv = rut.slice(-1);
    let formatted = '';
    let i = 0;
    for (let j = body.length - 1; j >= 0; j--) {
      formatted = body[j] + formatted;
      i++;
      if (i % 3 === 0 && j !== 0) formatted = '.' + formatted;
    }
    return formatted + '-' + dv;
  }

  validateRut(rut: string): boolean {
    rut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(rut)) return false;
    let body = rut.slice(0, -1);
    let dv = rut.slice(-1);
    let sum = 0, mul = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * mul;
      mul = mul === 7 ? 2 : mul + 1;
    }
    let expected = 11 - (sum % 11);
    let dvCalc = expected === 11 ? '0' : expected === 10 ? 'K' : expected.toString();
    return dv === dvCalc;
  }

  validateTelefono(tel: string): boolean {
    tel = tel.replace(/\s/g, '');
    return /^(\+?56)?0?9[9876543]\d{7}$/.test(tel);
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  validatePassword(pass: string): boolean {
    // 8-16 caracteres, al menos una mayúscula, un número y un carácter especial
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/.test(pass);
  }
}
