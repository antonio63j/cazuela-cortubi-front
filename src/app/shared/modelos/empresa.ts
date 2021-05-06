
export class DiaDescansoOpciones {
    static dias: string [] = [
        '',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado',
        'domingo'
        ];
  }

export class Empresa {
    id: number;
    nombre: string;
    telefono: string;
    direccion: string;
    provincia: string;
    email: string;
    urlWeb: string;
    descripcionBreve: string;
    horario: string;
    portada: string;
    horaEntrada: number;
    horaSalida: number;
    diasDescanso: string;
    horasMinPreparacionPedido: number;
    diasMaxRecogidaPedido: number;


    // cabeceraBienvenida: string;
    // bienvenida: string;
    // sliders: Slider;
}
