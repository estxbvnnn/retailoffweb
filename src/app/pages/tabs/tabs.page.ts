import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { scan, time } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-tabs',
  imports: [
    RouterLink, RouterOutlet,
    IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton
  ],
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>RetailOff</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="logout()">Salir</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-tabs>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="scan" [routerLink]="['/tabs/scan']">
        <ion-icon name="scan"></ion-icon>
        <ion-label>Scan</ion-label>
      </ion-tab-button>
      <ion-tab-button tab="history" [routerLink]="['/tabs/history']">
        <ion-icon name="time"></ion-icon>
        <ion-label>Historial</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>

  <router-outlet></router-outlet>
  `
})
export class TabsPage {
  private auth = inject(AuthService);

  constructor() {
    addIcons({ scan, time });
  }

  async logout() {
    await this.auth.logout();
    location.href = '/login';
  }
}
