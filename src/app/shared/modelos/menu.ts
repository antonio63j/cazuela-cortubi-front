import { MenuSugerencia } from './menu-sugerencia';

export class Menu {
    id: number;
    label: string;
    precio: number;
    descripcion: string;
    imgFileName: string;
    menuSugerencias: MenuSugerencia[] = [];
}
