import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonImg
} from '@ionic/angular/standalone';
import { scan, time } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-tabs',
  imports: [
    RouterLink, RouterOutlet,
    IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonImg
  ],
  styles: [`
    .title-wrap { display:flex; align-items:center; gap:10px; }
    .logo { height: 28px; width: auto; display:block; }
  `],
  template: `
  <ion-header>
    <ion-toolbar color="dark">
      <ion-title>
        <div class="title-wrap">
          <ion-img class="logo" src="/assets/img/logo.png" alt="RetailOff"></ion-img>
          <span>RetailOff</span>
        </div>
      </ion-title>
      <ion-buttons slot="end">
        <ion-button color="danger" (click)="logout()">Salir</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-tabs>
    <ion-tab-bar slot="bottom" color="dark">
      <ion-tab-button tab="scan" [routerLink]="['/tabs/scan']">
        <ion-icon [icon]="icons.scan"></ion-icon>
        <ion-label>Scan</ion-label>
      </ion-tab-button>
      <ion-tab-button tab="history" [routerLink]="['/tabs/history']">
        <ion-icon [icon]="icons.time"></ion-icon>
        <ion-label>Historial</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>

  <router-outlet></router-outlet>
  `
})
export class TabsPage {
  private auth = inject(AuthService);
  icons = { scan, time };

  async logout() {
    await this.auth.logout();
    location.href = '/login';
  }
}