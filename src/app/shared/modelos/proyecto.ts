import { Cliente } from './cliente';
import { Herramienta } from './herramienta';

export class Proyecto {
    id: number;
    nombre: string;
    inicio: string;
    fin: string;
    descripcion: string;
    herramientas: Herramienta[] = [];
    cliente: Cliente;
}
