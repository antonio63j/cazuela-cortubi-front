import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import swal from 'sweetalert2';

import { Sugerencia } from 'src/app/shared/modelos/sugerencia';
import { environment } from 'src/environments/environment';
import { ComponenteMenu } from 'src/app/shared/modelos/componente-menu.enum';
import { AuthService } from 'src/app/usuarios/auth.service';
import { PedidoService } from 'src/app/shared/services/pedido.service';

@Component({
  selector: 'app-carta-detalle',
  templateUrl: './carta-detalle.component.html',
  styleUrls: ['./carta-detalle.component.scss']
})
export class CartaDetalleComponent implements OnInit {
  host: string = environment.urlEndPoint;
  public sugerencia: Sugerencia;
  public cantidad = 0;

  constructor(
    public activeModal: NgbActiveModal,
    public authService: AuthService,
    public pedidoService: PedidoService
  ) {

  }


  aceptar(sugerencia: Sugerencia): void {

    if (this.cantidad < 1 || this.cantidad > 20) {
      swal.fire('Aviso', 'Cantidad deber estar entre 1 y 20', 'warning');
    } else {
      console.log('getion pedido');
      console.log('sugerencia:' + sugerencia.id);
      this.pedidoService.setSugerenciaCantidad (sugerencia, this.cantidad);
      this.activeModal.close('con accept');
    }

  }

  cambioCantidad(): void {
    console.log('cambioCantidad =' + this.cantidad);
  }

  ngOnInit(): void {

  }

}

