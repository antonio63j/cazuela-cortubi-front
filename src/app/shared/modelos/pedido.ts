import { Menu } from './menu';
import { Sugerencia } from './sugerencia';

export enum EstadoPedidoEnum {
    creacion = 'CREACION',
    confirmado = 'CONFIRMADO',
    rechazado = 'RECHAZADO',
    listo = 'LISTO',
    pagado = 'PAGADO'
}

export class CantidadesOpciones {
  static cantidades: number [] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}

export class PedidoLineaSugerencia {
    id: number;
    cantidad: number;
    precioInicio: number;
    sugerencia: Sugerencia;

    constructor() {
        this.id = null;
        this.cantidad = 0;
        this.precioInicio = 0;
        this.sugerencia = new Sugerencia();
        this.sugerencia.id = null;
    }
}

export class PedidoLineaMenu {
    id: number;
    cantidad: number;
    precioInicio: number;
    menu: Menu;
    primero: Sugerencia;
    segundo: Sugerencia;
    postre: Sugerencia;
}

export class Pedido {
    id: number;
    usuario: string;
    estadoPedido: EstadoPedidoEnum;
    total: number;
    numArticulos: number;

    fechaRegistro: Date;
    fhRecogidaSolicitada: Date;
    nota: string;
    pedidoLineaSugerencias: PedidoLineaSugerencia [] = [];
    pedidoLineaMenus: PedidoLineaMenu [] = [];

    constructor(usuario: string) {
       this.usuario = usuario;
    }

}
