import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from "src/app/servicio/Usuario";
import { Roles } from "src/app/servicio/Roles";
import { ServicioApiService } from 'src/app/servicio/servicio-api.service';
import { DatosJSON } from 'src/app/servicio/DatosJSON';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {


  usuarioobjeto: Usuario = new Usuario();
  rolesobjeto: Roles = new Roles();
  CRUD: DatosJSON = new DatosJSON();

  UsuarioListar: Usuario[] = [];
  RolesListar: Roles[] = [];
  usuarioID: any;

  constructor(
    private rutas: Router,
    private activarruta: ActivatedRoute,
    private controlalerta: AlertController,
    private crudservice: ServicioApiService
  ) {

    this.CRUD.MostrarUsuarioServer();
    this.CRUD.MostrarRoleServer();

    this.usuarioID = this.activarruta.snapshot.paramMap.get('uid'); // con el activador de la ruta obtenemos la ID de la URL
    const LeerUsuarios = localStorage.getItem("usuarios");
    if (LeerUsuarios != null) {
      this.UsuarioListar = JSON.parse(LeerUsuarios);
      this.UsuarioListar = this.UsuarioListar.filter(m => m.u_id != this.usuarioID);
    }
    console.log(this.UsuarioListar);
  }


  ngOnInit() {
    this.usuarioID = this.activarruta.snapshot.paramMap.get('uid'); // con el activador de la ruta obtenemos la ID de la URL
    const LeerUsuarios = localStorage.getItem("usuarios");
    if (LeerUsuarios != null) {
      this.UsuarioListar = JSON.parse(LeerUsuarios);
      this.UsuarioListar = this.UsuarioListar.filter(m => m.u_id != this.usuarioID);
    }
    console.log(this.UsuarioListar);

  }

  BuscarDatos(event) { // Busqueda de Datos
    const dato = event.target.value;

    const LeerUsuarios = localStorage.getItem("usuarios");
    if (LeerUsuarios != null) {
      this.UsuarioListar = JSON.parse(LeerUsuarios);
      if (dato && dato.trim() != '') {
        console.log(this.UsuarioListar);
        this.UsuarioListar = this.UsuarioListar.filter((respuesta: any) => {
          return (
            (respuesta.u_apellidos.indexOf(dato.toLocaleUpperCase()) > -1 && respuesta.u_id != 1)
          );
        });
      }
    }

  }

  Refrescar() {
    const LeerUsuarios = localStorage.getItem("usuarios");
    if (LeerUsuarios != null) {
      this.UsuarioListar = JSON.parse(LeerUsuarios);
      this.UsuarioListar = this.UsuarioListar.filter(m => m.u_id != this.usuarioID);
    }
    console.log(this.UsuarioListar);
  }

}
