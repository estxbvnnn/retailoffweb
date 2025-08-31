import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, ToastController } from '@ionic/angular/standalone';

import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastController);

  constructor() {
    // Opcional: feedback de auth
    this.auth.user$.subscribe(async (user) => {
      const t = await this.toast.create({
        message: user ? 'Sesión iniciada' : 'Sesión cerrada',
        duration: 1000,
        position: 'bottom',
      });
      await t.present();
    });
  }
}
