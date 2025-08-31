import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonTextarea
} from '@ionic/angular/standalone';
import { v4 as uuidv4 } from 'uuid';
import { ScanService } from '../../services/scan.service';
import { StorageService } from '../../services/storage.service';
import { MapComponent } from '../../components/map/map.component';
import { HistoryEntry } from '../../models/history-entry';

@Component({
  standalone: true,
  selector: 'app-scan',
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonTextarea,
    MapComponent
  ],
  template: `
  <ion-header><ion-toolbar><ion-title>Scan</ion-title></ion-toolbar></ion-header>
  <ion-content class="ion-padding">
    <ion-button expand="block" (click)="doScan()">Escanear QR / Barra</ion-button>
    <ion-button expand="block" fill="outline" (click)="paste()">Pegar contenido</ion-button>

    <ion-card *ngIf="last">
      <ion-card-header>
        <ion-card-title>Último resultado ({{ last.type }})</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div *ngIf="last.type === 'http'">
          {{ last.content }} <br />
          <ion-button size="small" (click)="openHttp(last.content)">Abrir</ion-button>
        </div>

        <div *ngIf="last.type === 'geo' && last.meta?.lat && last.meta?.lng">
          <strong>{{ last.meta?.title || 'Ubicación' }}</strong>
          <app-map [lat]="last.meta!.lat!" [lng]="last.meta!.lng!" [zoom]="15"></app-map>
        </div>

        <div *ngIf="last.type === 'text'">
          {{ last.content }}
        </div>
      </ion-card-content>
    </ion-card>
  </ion-content>
  `
})
export class ScanPage {
  private scanSvc = inject(ScanService);
  private storage = inject(StorageService);

  last: HistoryEntry | null = null;

  async doScan() {
    const content = await this.scanSvc.scan();
    if (!content) return;
    this.process(content);
  }

  async paste() {
    const content = prompt('Pega el contenido:');
    if (!content) return;
    this.process(content);
  }

  private async process(content: string) {
    const parsed = this.scanSvc.parse(content);
    const entry: HistoryEntry = {
      id: uuidv4(),
      createdAt: Date.now(),
      ...parsed
    };
    this.storage.add(entry);
    this.last = entry;

    if (entry.type === 'http') {
      await this.scanSvc.openHttp(entry.content);
    }
  }

  openHttp(url: string) {
    this.scanSvc.openHttp(url);
  }
}
