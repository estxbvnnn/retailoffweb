import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  usuario: any = null;
  editMode = false;
  error: string | null = null;

  nombre = '';
  apellido = '';
  telefono = '';
  email = '';

  async ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid') || this.auth.currentUser?.uid;
    if (uid) {
      const db = getFirestore();
      const ref = doc(db, 'usuarios', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        this.usuario = snap.data();
        this.nombre = this.usuario.nombre;
        this.apellido = this.usuario.apellido;
        this.telefono = this.usuario.telefono;
        this.email = this.usuario.email;
      }
    }
  }

  enableEdit() {
    this.editMode = true;
    this.error = null;
  }

  async save() {
    this.error = null;
    const uid = this.usuario?.uid;
    if (!uid) return;
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'usuarios', uid), {
        nombre: this.nombre,
        apellido: this.apellido,
        telefono: this.telefono,
        email: this.email
      });
      this.editMode = false;
      // Actualiza los datos locales
      this.usuario = { ...this.usuario, nombre: this.nombre, apellido: this.apellido, telefono: this.telefono, email: this.email };
    } catch (e: any) {
      this.error = e?.message || 'No se pudo actualizar';
    }
  }
}