import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from "src/app/servicio/Usuario";
import { Roles } from "src/app/servicio/Roles";
import { ServicioApiService } from 'src/app/servicio/servicio-api.service';
import { DatosJSON } from 'src/app/servicio/DatosJSON';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ConnectableObservable } from 'rxjs';

@Component({
    selector: 'app-sesion',
    templateUrl: './sesion.page.html',
    styleUrls: ['./sesion.page.scss'],
})
export class SesionPage implements OnInit {
    usuarioobjeto: Usuario = new Usuario();
    rolesobjeto: Roles = new Roles();
    CRUD: DatosJSON = new DatosJSON();

    UsuarioListar: Usuario[] = []; // creo un array

    constructor( // permite llamar todos los elementos de angular las clases que esta contoene (LIBRERIA)
        private crudServicio: ServicioApiService,// mandar los datos a la Base de Datos
        private rutas: Router,
        public formulario: FormBuilder,
        private activarruta: ActivatedRoute,
        private controlalerta: AlertController,
    ) {
        this.CRUD.MostrarUsuarioServer();
        this.CRUD.MostrarRoleServer();
    }

    ngOnInit() {
        const Leerusuarios = localStorage.getItem("usuarios"); // capturo el json
        if (Leerusuarios != null) {
            this.UsuarioListar = JSON.parse(Leerusuarios); // convierto el json en array
            console.log(this.UsuarioListar)
        }

    }

    async Mensaje() {
        const elementoalerta = await this.controlalerta.create({ // hace que el tiempo de ejecucion sea inmediato
            header: 'Usuarios y Contraseña Incorrectos',
            message: 'Ingrese nuevamente',
            buttons: ['Aceptar']
        });
        await elementoalerta.present(); // muestre la alert creada al usuario
    }

    async Error(id: String) {
        const elementoalerta = await this.controlalerta.create({ // hace que el tiempo de ejecucion sea inmediato
            header: 'Mensaje',
            message: '' + id + '',
            buttons: ['Aceptar']
        });

        await elementoalerta.present(); // muestre la alert creada al usuario
    }

    async Validar() {
        const elementoalerta = await this.controlalerta.create({ // hace que el tiempo de ejecucion sea inmediato
            header: 'Todos los datos son obligatorios',
            message: 'Ingrese nuevamente',
            buttons: ['Aceptar']
        });

        await elementoalerta.present(); // muestre la alert creada al usuario
    }


    IniciarSesion() {
        console.log(this.usuarioobjeto.u_rut + " " + this.usuarioobjeto.u_password);
        if (this.usuarioobjeto.u_rut === '' || this.usuarioobjeto.u_password === '') {
            this.Validar();
        } else {
            // debugger;
            let validar;
            const bdpresente = localStorage.getItem("usuarios");
            var rol, idu = 0;
            if (bdpresente != null) {
                const arrayusuario = JSON.parse(bdpresente);
                console.log(this.UsuarioListar);
                var tamano = this.UsuarioListar.filter(value => value.u_rut === this.usuarioobjeto.u_rut.toLocaleUpperCase()).length; // buscar informacion en un array
                if (tamano != 0) {
                    for (let i = 0; i < arrayusuario.length; i++) {
                        if ((this.usuarioobjeto.u_rut.toLocaleUpperCase() == arrayusuario[i].u_rut) && (this.usuarioobjeto.u_password == arrayusuario[i].u_password)) {
                            rol = arrayusuario[i].u_rolFK;
                            idu = arrayusuario[i].u_id;
                        }
                    }

                    console.log("ROL" + rol + " ID " + idu);
                    if (rol == 1) {
                        this.rutas.navigate(['/informacion/' + idu]) // app-routing.module
                    } else if (rol == 2) {
                        this.rutas.navigate(['/informacion/' + idu])
                    } else {
                        this.Mensaje();
                    }

                } else {
                    this.Mensaje();
                }
                this.usuarioobjeto.u_rut = '';
                this.usuarioobjeto.u_password = "";
            }
        }
    }
}

