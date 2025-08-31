import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonText
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { MapComponent } from '../../components/map/map.component';
import { HistoryEntry } from '../../models/history-entry';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-history',
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonText,
    MapComponent,
    RouterLink // <-- habilita [routerLink] en los botones
  ],
  styles: [`
    .info-card { max-width: 860px; margin: 0 auto; }
    .logo { max-width: 160px; margin: 8px auto; display:block; }
    .btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
  `],
  template: `
  <ion-header>
    <ion-toolbar color="dark">
      <ion-title>{{ isInformacion ? 'Información' : 'Historial' }}</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <!-- Modo Información (/informacion) -->
    <ng-container *ngIf="isInformacion; else historyTpl">
      <ion-card class="info-card">
        <ion-img class="logo" src="/assets/img/logo.png" alt="RetailOff"></ion-img>
        <ion-card-header class="ion-text-center">
          <ion-card-title>Bienvenido(a) a Retail Off</ion-card-title>
        </ion-card-header>
        <ion-card-content class="ion-text-justify">
          <p>
            Retail Off es una plataforma para facilitar tus compras del hogar de forma rápida y simple:
            explora categorías, tendencias y novedades, revisa opiniones y compra desde tu dispositivo.
          </p>
          <div class="btns ion-margin-top">
            <ion-button color="danger" [routerLink]="['/mision']">Ver Misión</ion-button>
            <ion-button fill="outline" color="dark" [routerLink]="['/perfil']">Ir a Perfil</ion-button>
          </div>
        </ion-card-content>
      </ion-card>
    </ng-container>

    <!-- Modo Historial (/tabs/history) -->
    <ng-template #historyTpl>
      <ion-button expand="block" color="danger" (click)="clear()">Limpiar historial</ion-button>
      <ion-list>
        <ion-item *ngFor="let h of history">
          <ion-label class="ion-text-wrap">
            <h2>{{ h.type.toUpperCase() }} — {{ h.createdAt | date:'short' }}</h2>
            <p>{{ h.content }}</p>
            <div *ngIf="h.type === 'geo' && h.meta?.lat && h.meta?.lng" style="margin-top:8px;">
              <app-map [lat]="h.meta!.lat!" [lng]="h.meta!.lng!" [zoom]="13"></app-map>
            </div>
          </ion-label>
        </ion-item>
      </ion-list>
    </ng-template>
  </ion-content>
  `
})
export class HistoryPage {
  private storage = inject(StorageService);
  private router = inject(Router);
  history: HistoryEntry[] = [];

  get isInformacion() {
    return this.router.url.split('?')[0].split('#')[0] === '/informacion';
  }

  constructor() {
    this.storage.list$.subscribe(l => this.history = l);
  }

  clear() {
    if (confirm('¿Borrar historial?')) this.storage.clear();
  }
}
