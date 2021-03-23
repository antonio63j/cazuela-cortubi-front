import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import swal from 'sweetalert2';

import { Menu } from 'src/app/shared/modelos/menu';
import { MenuSugerencia } from 'src/app/shared/modelos/menu-sugerencia';
import { environment } from 'src/environments/environment';
import { ComponenteMenu } from 'src/app/shared/modelos/componente-menu.enum';


@Component({
  selector: 'app-menu-detalle',
  templateUrl: './menu-detalle.component.html',
  styleUrls: ['./menu-detalle.component.scss']
})

export class MenuDetalleComponent implements OnInit {
  host: string = environment.urlEndPoint;
  public menu: Menu;
  public cantidad = 0;
  
  primeros: MenuSugerencia[] = [];
  segundos: MenuSugerencia[] = [];
  postres: MenuSugerencia[] = [];

  primero: any;
  segundo: any;
  postre: any;

  constructor(
    public activeModal: NgbActiveModal
  ) {

   }


  aceptar(): void {
    if (this.primero === undefined ||
        this.segundo === undefined || 
        this.postre === undefined ) {
      swal.fire('Aviso', 'Falta opción por seleccionar', 'warning');
    } else {
        if (this.cantidad < 1 || this.cantidad > 20) {
          swal.fire('Aviso', 'Cantidad deber estar entre 1 y 20', 'warning');
        } else {
            console.log('getion pedido');
           this.activeModal.close('con accept');
        }
    }
  }

  cambioCantidad():void {
     console.log(JSON.stringify(this.menu.menuSugerencias));
  }
  ngOnInit(): void {
      this.primeros = this.menu.menuSugerencias.filter(element => {
        return element.componenteMenu === ComponenteMenu.primero;
      });  
      this.segundos = this.menu.menuSugerencias.filter(element => {
        return element.componenteMenu === ComponenteMenu.segundo;
      });
      this.postres = this.menu.menuSugerencias.filter(element => {
        return element.componenteMenu === ComponenteMenu.postre;
      });

      console.log('primeros:');
      console.log(this.primeros);
      console.log(this.segundos);
      console.log(this.postres);
  }

}
