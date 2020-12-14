import { Injectable } from '@angular/core';
import { TipoHerramienta } from '../modelos/tipo-herramienta';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AnonymousSubject } from 'rxjs/internal/Subject';
@Injectable({
  providedIn: 'root'
})


export class TiposHerramientasService {

  tipoHerramientas: TipoHerramienta[] = [
    { routLink: '/herramientas/tipo', key: 'Framework', class: 'fa fa-monument', keyView: 'Frameworks' },
    { routLink: '/herramientas/tipo', key: 'Lenguaje', class: 'fa fa-monument', keyView: 'Lenguajes programación' },
    { routLink: '/herramientas/tipo', key: 'IDE', class: 'fa fa-monument', keyView: 'IDE' },
    { routLink: '/herramientas/tipo', key: 'S.O.', class: 'fa fa-monument', keyView: 'Sistemas Operativos' },
    { routLink: '/herramientas/tipo', key: 'ControlVersiones', class: 'fa fa-monument', keyView: 'Control de Versiones' },
    { routLink: '/herramientas/tipo', key: 'Comunicaciones', class: 'fa fa-monument', keyView: 'Comunicaciones' },
    { routLink: '/herramientas/tipo', key: 'Utilidad', class: 'fa fa-monument', keyView: 'Utilidades' },
    { routLink: '/herramientas/tipo', key: 'TODOS', class: 'fa fa-monument', keyView: 'Todos los tipos' },
  ];

  constructor() { }

  getTipoHerramientas() {
    return this.tipoHerramientas;
  }

  getKeyView (key: string): string {
   let item: any;
   item = this.tipoHerramientas.filter(t => t.key === key)[0];
   return item.keyView;
  }

}
