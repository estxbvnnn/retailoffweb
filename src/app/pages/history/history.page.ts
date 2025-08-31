import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton
} from '@ionic/angular/standalone';
import { StorageService } from '../../services/storage.service';
import { MapComponent } from '../../components/map/map.component';
import { HistoryEntry } from '../../models/history-entry';

@Component({
  standalone: true,
  selector: 'app-history',
  imports: [
    CommonModule, DatePipe,
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton,
    MapComponent
  ],
  template: `
  <ion-header><ion-toolbar><ion-title>Historial</ion-title></ion-toolbar></ion-header>
  <ion-content class="ion-padding">
    <ion-button expand="block" color="medium" (click)="clear()">Limpiar historial</ion-button>

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
  </ion-content>
  `
})
export class HistoryPage {
  private storage = inject(StorageService);
  history: HistoryEntry[] = [];

  constructor() {
    this.storage.list$.subscribe(list => this.history = list);
  }

  clear() {
    if (confirm('¿Borrar historial?')) this.storage.clear();
  }
}
