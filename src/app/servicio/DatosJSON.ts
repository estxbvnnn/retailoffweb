export class DatosJSON {
    MostrarUsuarioServer() {
        if (localStorage.getItem('usuarios') === null || localStorage.getItem('usuarios') == undefined) {
            console.log('No usuarios Creating...');
            let usua = [
                {
                    u_id: 1,
                    u_rut: '12345-A',
                    u_nombres: 'LUIS',
                    u_apellidos: 'PRADO',
                    u_celular: 12345,
                    u_correo: 'luis@gmail.com',
                    u_password: '12345',
                    u_rolFK: 1
                }
            ];

            localStorage.setItem('usuarios', JSON.stringify(usua));
            return
        } else {
            console.log('Mostrar usuarios...');
        }
    }


    MostrarRoleServer() {
        if (localStorage.getItem('roles') === null || localStorage.getItem('roles') == undefined) {
            console.log('No roles Creating...');
            let usu = [
                {
                    rr_id: '1',
                    rr_rol: 'ADMIN'
                },
                {
                    rr_id: '2',
                    rr_rol: 'USUARIO'
                }
            ];

            localStorage.setItem('roles', JSON.stringify(usu));
            return
        } else {
            console.log('Mostrar roles...');
        }
    }
}