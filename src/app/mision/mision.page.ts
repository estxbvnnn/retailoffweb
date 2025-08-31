import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Usuario } from "src/app/servicio/Usuario";
import { Roles } from "src/app/servicio/Roles";
import { ServicioApiService } from 'src/app/servicio/servicio-api.service';
import { DatosJSON } from 'src/app/servicio/DatosJSON';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonFooter, IonGrid, IonRow, IonCol, IonIcon, IonCardContent, IonImg, IonText, IonButton
} from '@ionic/angular/standalone';


@Component({
  standalone: true,
  selector: 'app-mision',
  // Reemplaza templateUrl/styleUrls por template/styles inline
  template: `
  <ion-header>
    <ion-toolbar color="dark">
      <ion-title>Retail Off</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="page-bg ion-padding">
    <ion-card class="dark-card">
      <ion-img class="logo" src="/assets/img/logo.png" alt="Retail Off"></ion-img>
      <ion-card-header class="ion-text-center">
        <ion-card-title>Misión</ion-card-title>
      </ion-card-header>
      <ion-card-content class="ion-text-justify">
        <p>
          En Retail Off reinventamos la forma de comprar artículos para el hogar: una experiencia simple,
          rápida y accesible desde tu dispositivo.
        </p>
      </ion-card-content>
    </ion-card>

    <ion-card class="dark-card">
      <ion-card-content>
        <p class="ion-margin-bottom">- Compra ágil y cómoda desde cualquier lugar.</p>
        <p class="ion-margin-bottom">- Explora categorías, tendencias y reseñas confiables.</p>
        <p>- Precios competitivos y ofertas destacadas.</p>

        <div class="btns ion-margin-top">
          <ion-button color="danger" [routerLink]="['/informacion']">Información</ion-button>
          <!-- Botón de Visión removido -->
          <ion-button fill="outline" color="dark" [routerLink]="['/perfil']">Ir a Perfil</ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  </ion-content>

  <ion-footer>
    <ion-toolbar color="dark"></ion-toolbar>
  </ion-footer>
  `,
  styles: [`
    .page-bg { min-height: 100%; background: linear-gradient(180deg,#0a0a0a,#111); }
    .dark-card { background:#161616; border:1px solid #272727; color:#fff; max-width: 900px; margin: 12px auto; }
    .logo { width: 140px; display:block; margin: 12px auto 0; }
    .btns { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
  `],
  imports: [
    CommonModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonFooter, IonGrid, IonRow, IonCol, IonIcon, IonCardContent, IonImg, IonText, IonButton
  ]
})
export class MisionPage implements OnInit {


  usuarioobjeto: Usuario = new Usuario();
  rolesobjeto: Roles = new Roles();
  CRUD: DatosJSON = new DatosJSON();

  UsuarioListar: Usuario[] = [];
  RolesListar: Roles[] = [];
  usuarioID: any;

  constructor(
    private crudServicio: ServicioApiService,// mandar los datos a la Base de Datos
    private rutas: Router,
    private activarruta: ActivatedRoute,
  ) {
    this.CRUD.MostrarUsuarioServer();
    this.CRUD.MostrarRoleServer();
    this.usuarioID = this.activarruta.snapshot.paramMap.get('uid'); // con el activador de la ruta obtenemos la ID de la URL

  }

  ngOnInit() {
    this.usuarioID = this.activarruta.snapshot.paramMap.get('uid'); // con el activador de la ruta obtenemos la ID de la URL

    const LeerUsuarios = localStorage.getItem("usuarios");
    if (LeerUsuarios != null) {
      this.UsuarioListar = JSON.parse(LeerUsuarios);
      this.UsuarioListar = this.UsuarioListar.filter(m => m.u_id == this.usuarioID);

    }
    console.log(this.UsuarioListar);

  }

  Refrescar() {
    const LeerUsuarios = localStorage.getItem("usuarios");
    if (LeerUsuarios != null) {
      this.UsuarioListar = JSON.parse(LeerUsuarios);
      this.UsuarioListar = this.UsuarioListar.filter(m => m.u_id == this.usuarioID);

    }
  }


}
