import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonText
} from '@ionic/angular/standalone';
import { ScanService } from '../../services/scan.service';
import { StorageService } from '../../services/storage.service';
import { MapComponent } from '../../components/map/map.component';
import { HistoryEntry } from '../../models/history-entry';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

function genId() { return Date.now().toString(36) + Math.random().toString(36).substring(2,7); }

@Component({
  standalone: true,
  selector: 'app-scan',
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, MapComponent
  ],
  styles: [`
    .accent { border-left: 4px solid var(--ion-color-danger); padding-left: 10px; }
    .code-card { max-width: 680px; margin: 12px auto; }
    .code-wrap { display:flex; align-items:center; gap:16px; }
    .qr { width: 120px; height: 120px; object-fit: contain; border: 2px solid var(--ion-color-dark); background:#fff; }
    .code-text { font-size: 1.1rem; font-weight: 600; color: var(--ion-color-dark); }
  `],
  template: `
  <ion-header>
    <ion-toolbar color="dark">
      <ion-title>Scan</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <!-- Código + QR antes de escanear -->
    <ion-card *ngIf="showCode" class="code-card ion-padding">
      <ion-card-header><ion-card-title>Tu código para escanear</ion-card-title></ion-card-header>
      <ion-card-content>
        <div class="code-wrap">
          <img class="qr" [src]="qrUrl" alt="QR">
          <div>
            <div class="code-text">{{ code }}</div>
            <ion-button size="small" color="danger" class="ion-margin-top" (click)="copyCode()">Copiar código</ion-button>
            <ion-button size="small" fill="clear" (click)="dismissCode()">Cerrar</ion-button>
          </div>
        </div>
        <ion-text color="medium">
          Copia este código y pégalo en el campo de escaneo para confirmar: “escaneo exitoso”.        </ion-text>
      </ion-card-content>
    </ion-card>

    <ion-button expand="block" color="danger" (click)="doScan()">Escanear QR / Barra</ion-button>

    <ion-card *ngIf="last" class="accent ion-margin-top">
      <ion-card-header><ion-card-title>Último resultado ({{ last.type }})</ion-card-title></ion-card-header>
      <ion-card-content>
        <div *ngIf="last.type === 'http'">
          {{ last.content }} <br/><ion-button size="small" color="danger" (click)="openHttp(last.content)">Abrir</ion-button>
        </div>
        <div *ngIf="last.type === 'geo' && last.meta?.lat && last.meta?.lng">
          <strong>{{ last.meta?.title }}</strong>
          <app-map [lat]="last.meta!.lat!" [lng]="last.meta!.lng!" [zoom]="15"></app-map>
        </div>
        <div *ngIf="last.type === 'text'">{{ last.content }}</div>
      </ion-card-content>
    </ion-card>
  </ion-content>
  `
})
export class ScanPage {
  private scanSvc = inject(ScanService);
  private storage = inject(StorageService);
  private router = inject(Router);
  private toast = inject(ToastController);
  private auth = inject(AuthService);

  // Tarjeta de código/QR
  showCode = true;
  code = '';
  qrUrl = '';

  // Último resultado
  last: HistoryEntry | null = null;

  constructor() {
    const uid = this.auth.currentUser?.uid ?? '';
    this.code = this.genCode(uid);
    this.qrUrl = this.buildQrUrl(this.code);
  }

  private genCode(seed: string) {
    const partA = (seed || 'RET').slice(0, 5).toUpperCase().padEnd(5, 'X');
    const partB = Date.now().toString(36).slice(-5).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 4).toUpperCase();
    return `${partA}-${partB}${rand}`;
  }
  private buildQrUrl(data: string) {
    const d = encodeURIComponent(data);
    return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${d}`;
  }
  async copyCode() {
    try {
      if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(this.code);
      else {
        const ta = document.createElement('textarea');
        ta.value = this.code; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
      }
    } catch { /* no-op */ }
  }
  dismissCode() { this.showCode = false; }

  async doScan() {
    const content = await this.scanSvc.scan();
    if (!content) return;
    const parsed = this.scanSvc.parse(content);
    const entry: HistoryEntry = { id: genId(), createdAt: Date.now(), ...parsed };
    this.storage.add(entry);
    this.last = entry;

    const t = await this.toast.create({ message: 'Escaneo exitoso', duration: 1200, color: 'success' });
    await t.present();
    await t.onDidDismiss();
    this.showCode = false;
    this.router.navigateByUrl('/informacion', { replaceUrl: true }); // ir a la página de información
  }

  openHttp(url: string) {
    this.scanSvc.openHttp(url);
  }
}
