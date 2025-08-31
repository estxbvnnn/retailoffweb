import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonCard, IonButton, IonIcon,
  IonGrid, IonRow, IonCol, IonFooter, IonList
} from '@ionic/angular/standalone';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonCard, IonButton, IonIcon,
    IonGrid, IonRow, IonCol, IonFooter, IonList
  ]
})
export class PerfilPage {

  usuarioobjeto: any = {
    u_id: '', u_rolFK: '', u_rut: '',
    u_nombres: '', u_apellidos: '',
    u_celular: '', u_correo: '',
    u_password: '' // No se guarda en Firestore por seguridad
  };
  usuarioID: string = '';

  constructor(
    private rutas: Router,
    private activarruta: ActivatedRoute,
    private controlalerta: AlertController,
    private toastCtrl: ToastController,
    private auth: AuthService
  ) {
  }

  async ngOnInit() {
    // Obtener UID desde Auth; si no existe, intenta desde la ruta; si no, al login
    const uid = this.auth.currentUser?.uid || (this.activarruta.snapshot.paramMap.get('uid') ?? '');
    if (!uid) {
      this.rutas.navigateByUrl('/login', { replaceUrl: true });
      return;
    }
    this.usuarioID = uid;

    // Cargar perfil desde Firestore y mapear a los campos del template
    const p = await this.auth.getUserProfile(uid);
    if (p) {
      this.usuarioobjeto.u_id = p.uid;
      this.usuarioobjeto.u_rut = p.rut || '';
      this.usuarioobjeto.u_nombres = p.nombre || '';
      this.usuarioobjeto.u_apellidos = p.apellido || '';
      this.usuarioobjeto.u_celular = p.telefono || '';
      this.usuarioobjeto.u_correo = p.email || '';
      // u_rolFK lo dejas si lo manejas en otra colección; aquí no se modifica
    }
  }

  async Actualizar() {
    if (!this.usuarioID) {
      this.rutas.navigateByUrl('/login', { replaceUrl: true });
      return;
    }

    // Validación mínima de campos requeridos (sin contraseña)
    if (!this.usuarioobjeto.u_rut ||
        !this.usuarioobjeto.u_nombres ||
        !this.usuarioobjeto.u_apellidos ||
        !this.usuarioobjeto.u_celular ||
        !this.usuarioobjeto.u_correo) {
      const t = await this.toastCtrl.create({ message: 'Complete los campos obligatorios', duration: 1500, color: 'danger' });
      await t.present();
      return;
    }

    try {
      await this.auth.updateUserProfile(this.usuarioID, {
        rut: String(this.usuarioobjeto.u_rut).toUpperCase(),
        nombre: String(this.usuarioobjeto.u_nombres).toUpperCase(),
        apellido: String(this.usuarioobjeto.u_apellidos).toUpperCase(),
        telefono: String(this.usuarioobjeto.u_celular),
        email: String(this.usuarioobjeto.u_correo).toLowerCase(),
        // createdAt no se toca al actualizar
      });
      const t = await this.toastCtrl.create({ message: 'Perfil actualizado', duration: 1200, color: 'success' });
      await t.present();
    } catch (e) {
      const t = await this.toastCtrl.create({ message: 'Error al actualizar perfil', duration: 1500, color: 'danger' });
      await t.present();
    }
  }
}