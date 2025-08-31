import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from "src/app/servicio/Usuario";
import { Roles } from "src/app/servicio/Roles";
import { ServicioApiService } from 'src/app/servicio/servicio-api.service';
import { DatosJSON } from 'src/app/servicio/DatosJSON';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

  private router = inject(Router);
  private auth = inject(AuthService);

  usuario: any = null;

  constructor(
      private crudServicio: ServicioApiService,// mandar los datos a la Base de Datos
      private rutas: Router,
      private activarruta: ActivatedRoute,
  ) {
      this.CRUD.MostrarUsuarioServer();
      this.CRUD.MostrarRoleServer();
      this.usuarioID = this.activarruta.snapshot.paramMap.get('uid'); // con el activador de la ruta obtenemos la ID de la URL

  }

  async ngOnInit() {
    const uid = this.auth.currentUser?.uid;
    if (uid) {
      const db = getFirestore();
      const ref = doc(db, 'usuarios', uid);
      const snap = await getDoc(ref);
      this.usuario = snap.exists() ? snap.data() : null;
    }
  }

  Refrescar() {
      const LeerUsuarios = localStorage.getItem("usuarios");
      if (LeerUsuarios != null) {
          this.UsuarioListar = JSON.parse(LeerUsuarios);
          this.UsuarioListar = this.UsuarioListar.filter(m => m.u_id == this.usuarioID);

      }
  }

  goMision() {
    this.router.navigate(['/mision']); // antes: navegaba mal o faltaba la ruta
  }
  goPerfil() {
    if (this.usuario?.uid) {
      this.router.navigate(['/perfil', this.usuario.uid]);
    }
  }
  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}




