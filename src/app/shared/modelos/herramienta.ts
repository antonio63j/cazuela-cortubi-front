import { Proyecto } from './proyecto';

export interface IHerramienta {
    id: number;
    nombre: string;
    tipo: string;
    nivel: string;
    comentario: string;
    // proyectos: Proyecto[] = [];
    proyectos: Proyecto[];
}


export class Herramienta implements IHerramienta {
    id: number;
    nombre: string;
    tipo: string;
    nivel: string;
    comentario: string;
    proyectos: Proyecto[] = [];
}


