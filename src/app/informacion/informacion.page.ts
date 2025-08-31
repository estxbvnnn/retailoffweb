import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from "src/app/servicio/Usuario";
import { Roles } from "src/app/servicio/Roles";
import { ServicioApiService } from 'src/app/servicio/servicio-api.service';
import { DatosJSON } from 'src/app/servicio/DatosJSON';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

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




