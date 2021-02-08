import { MenuSugerencia } from './menu-sugerencia';

export class Menu {
    id: number;
    label: string;
    descripcion: string;
    imgFileName: string;
    menuSugerencias: MenuSugerencia[] = [];
}
