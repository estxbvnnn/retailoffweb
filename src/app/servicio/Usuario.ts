export class Usuario {
    u_id: number;
    u_rut: String;
    u_nombres: String;
    u_apellidos: String;
    u_celular: number;
    u_correo: String;
    u_password: String;
    u_rolFK: number;
    
    constructor() {
      this.u_id = 0;
      this.u_rut = '';
      this.u_nombres = '';
      this.u_apellidos = '';
      this.u_celular = 0;
      this.u_correo = '';
      this.u_password = '';
      this.u_rolFK = 0;
    }
  
  }