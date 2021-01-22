import { Proyecto } from './proyecto';
// import { DetalleActividadComponent } from '../clientes/detalle-actividad/detalle-actividad.component';

export class Cliente {
    id: number;
    empresa: string;
    cliente: string;
    inicio: string;
    fin: string;
    sector: string;
    empresafoto: string;
    clientefoto: string;
    actividad: string;
    experiencia: string;
    proyectos: Proyecto[] = [];
}
