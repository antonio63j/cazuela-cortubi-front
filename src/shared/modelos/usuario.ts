export class Usuario {
    id: number;
    username: string;
    password: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    email: string;
    // fechaRegistro: Date;
    // fechaActivado: Date;
    // codActivacion: string;
    fechaSolCambioPassword: Date;
    codCambioPassw: string;
    esperandoCambioPassw: boolean;
    enabled: boolean;
    aceptaEmails: boolean;

    roles: string[] = [];
}
