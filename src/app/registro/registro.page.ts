import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from "src/app/servicio/Usuario";
import { Roles } from "src/app/servicio/Roles";
import { ServicioApiService } from 'src/app/servicio/servicio-api.service';
import { DatosJSON } from 'src/app/servicio/DatosJSON';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  usuarioobjeto: Usuario = new Usuario();
  rolesobjeto: Roles = new Roles();
  CRUD: DatosJSON = new DatosJSON();

  UsuarioListar: Usuario[] = [];
  RolesListar: Roles[] = [];
  usuarioID: any;

  datoenviado = false;

  constructor(
    private crudServicio: ServicioApiService,// mandar los datos a la Base de Datos
    private rutas: Router,
    public formulario: FormBuilder,
    private activarruta: ActivatedRoute,
    private controlalerta: AlertController,
  ) {
    this.CRUD.MostrarUsuarioServer();
    this.CRUD.MostrarRoleServer();
    this.usuarioID = this.activarruta.snapshot.paramMap.get('uid');

    const Leerusuarios = localStorage.getItem("usuarios");
    if (Leerusuarios != null) {
      this.UsuarioListar = JSON.parse(Leerusuarios);
      console.log(this.UsuarioListar)
    }

  }


  ngOnInit() {
    this.usuarioID = this.activarruta.snapshot.paramMap.get('uid');
  }

  async Validar() {
    const elementoalerta = await this.controlalerta.create({ // hace que el tiempo de ejecucion sea inmediato
      header: 'Todos los datos son obligatorios',
      message: 'Ingrese nuevamente',
      buttons: ['Aceptar']
    });

    await elementoalerta.present(); // muestre la alert creada al usuario
  }

  async Existe() {
    const elementoalerta = await this.controlalerta.create({ // hace que el tiempo de ejecucion sea inmediato
      header: 'El Número de Indentificion está registrado',
      message: 'Ingrese nuevamente',
      buttons: ['Aceptar']
    });

    await elementoalerta.present(); // muestre la alert creada al usuario
  }

  async Correcto() {
    const elementoalerta = await this.controlalerta.create({ // hace que el tiempo de ejecucion sea inmediato
      header: 'Registro Exitoso',
      message: 'Excelente',
      buttons: ['Aceptar']
    });

    await elementoalerta.present(); // muestre la alert creada al usuario
  }

  Registrar(): any {
    if (this.usuarioobjeto.u_rut === '' || this.usuarioobjeto.u_nombres === '' || this.usuarioobjeto.u_apellidos === '' || this.usuarioobjeto.u_celular === 0 || this.usuarioobjeto.u_password === '' || this.usuarioobjeto.u_correo === '') {
      this.Validar();
    } else {
      // debugger;
      const bdpresente = localStorage.getItem("usuarios");
      if (bdpresente != null) {
        const arrayviejo = JSON.parse(bdpresente);


        console.log(this.usuarioobjeto.u_rut.toLocaleUpperCase());

        var tamano = this.UsuarioListar.filter(value => value.u_rut === this.usuarioobjeto.u_rut.toLocaleUpperCase()).length;
        console.log("VALIDACION " + tamano);
        if (tamano != 0) {
          this.Existe();
          this.UsuarioListar = arrayviejo;
        } else {
          this.usuarioobjeto.u_id = arrayviejo.length + 1;
          this.usuarioobjeto.u_rut = this.usuarioobjeto.u_rut.toLocaleUpperCase();
          this.usuarioobjeto.u_nombres = this.usuarioobjeto.u_nombres.toLocaleUpperCase();
          this.usuarioobjeto.u_apellidos = this.usuarioobjeto.u_apellidos.toLocaleUpperCase();
          this.usuarioobjeto.u_correo = this.usuarioobjeto.u_correo.toLocaleLowerCase();
          this.usuarioobjeto.u_rolFK = 2;
          arrayviejo.push(this.usuarioobjeto); // captura los datos y los envia
          this.Correcto();
          this.UsuarioListar = arrayviejo;
          localStorage.setItem("usuarios", JSON.stringify(arrayviejo));
          const Leerusuarios = localStorage.getItem("usuarios");
          if (Leerusuarios != null) {
            this.UsuarioListar = JSON.parse(Leerusuarios);
            console.log(this.UsuarioListar)
          }
          this.rutas.navigate(['/home/'])

        }
      } else {
        /*
             const arraynuevo = [];
             arraynuevo.push(this.usuarioobjeto); // captura los datos y los envia
             this.UsuarioListar = arraynuevo;
             localStorage.setItem("Usuarios", JSON.stringify(arraynuevo));
             */

      }
    }

  }
}
