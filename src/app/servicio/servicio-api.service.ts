import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Usuario } from "./Usuario";
import { DatosJSON } from './DatosJSON';
@Injectable({
  providedIn: 'root'
})
export class ServicioApiService extends DatosJSON  {

  constructor(private ClienteHttp: HttpClient) {
    super();
    console.log('Usuarios Cargando');
    this.MostrarUsuarioServer();
    this.MostrarRoleServer();
  }

  RolesMostrar() {
    let roles = JSON.parse(localStorage.getItem('roles') || '{}');
    return roles;
  }

  /////// USUARIO ///////////

  
  UsuarioMostrar() { // llama la id del Metodo
    let usuaios = JSON.parse(localStorage.getItem('usuarios') || '');
    return usuaios;
  }


  UsuarioBuscarID(id) {
    let usua = JSON.parse(localStorage.getItem('usuarios') || '{}');
  
    console.log(usua[0].u_nombres );

    for (let i = 0; i < usua.length; i++) {
      if (usua[i].u_id == id.u_id) {
        localStorage.setItem('usuarios', JSON.stringify(usua[i]));
      }
    }
  }

  UsuarioAgregar(usuario: Usuario) {
    let usua = JSON.parse(localStorage.getItem('usuarios') || '{}');
    usua.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuario));
  }


  UsuarioEliminar(id) {
    let usua = JSON.parse(localStorage.getItem('usuarios') || '{}');
    for (let i = 0; i < usua.length; i++) {
      if (usua[i].id == id) {
        usua.splice(i, 1);
      }
    }
    localStorage.setItem('usuarios', JSON.stringify(usua));
  }


}
