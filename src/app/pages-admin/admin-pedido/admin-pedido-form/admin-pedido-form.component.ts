import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { EstadoPedidoEnum, Pedido } from 'src/app/shared/modelos/pedido';
import { AdminPedidoService } from '../admin-pedido.service';
import swal from 'sweetalert2';
import { OpcionesSelect } from 'src/app/shared/componentes/filtro/field.interface';
import { FormControl, Validators } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { environment } from 'src/environments/environment';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-admin-pedido-form',
  templateUrl: './admin-pedido-form.component.html',
  styleUrls: ['./admin-pedido-form.component.scss']
})
export class AdminPedidoFormComponent implements OnInit, OnDestroy {

  private subscriptionParams$: Subscription = null;
  private unsubscribe$ = new Subject();
  public observ$: Subscription = null;

  public opcionesEstado: OpcionesSelect[];
  public host: string = environment.urlEndPoint;
  public tipoControl = new FormControl('', Validators.required);

  public pedido: Pedido;
  public estado: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private adminPedidoService: AdminPedidoService,
    private location: Location
  ) {
    this.opcionesEstado = (Object.keys(EstadoPedidoEnum).map(key => {
      return {
        value: key,
        viewValue: EstadoPedidoEnum[key],
      };
    }));
    this.opcionesEstado.forEach((element, index) => {
      if (element.value === 'creacion') { this.opcionesEstado.splice(index, 1); }
    });

    console.log(`this.opecionesEstado=${JSON.stringify(this.opcionesEstado)}`);
  }

  ngOnInit(): void {
    this.subscripcionGestionParams();

  }

  subscripcionGestionParams(): void {
    this.subscriptionParams$ = this.activatedRoute.params
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(params => this.gestionParams(params));
  }

  gestionParams(params: any): void {
    console.log(`parmas:${JSON.stringify(params)}`);

    const pedidoId = params.pedidoId;
    this.getPedido(pedidoId);
  }

  getPedido(pedidoId: string): void {
    this.adminPedidoService.getPedido(pedidoId)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((response: any) => {
        })
      )
      .subscribe(
        response => {
          this.pedido = response.data as Pedido;
          this.estado = this.pedido.estadoPedido.toLowerCase();
          this.calculosPedido(this.pedido);
          console.log(`pedido=${JSON.stringify(this.pedido)}`);
        },
        err => {
          console.log(err);
          swal.fire('Error carga de pedido ', err.status, 'error');
        }
      );
  }

  cambiarEstado(pedido: Pedido): void {
    pedido.estadoPedido = this.estado.toUpperCase();
    console.log(`pedido to save=${JSON.stringify(pedido)}`);

    this.observ$ = this.adminPedidoService.save(this.pedido).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        response => {
          if (response == null) {
          } else {
            this.pedido = response.data;
          }
        },
        err => {
          if (err.status === 400) {
            swal.fire('Error en validación de datos ', `error.status = ${err.status.toString()}`, 'error');
          } else {
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error al añadir al carrito ', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  salir(): void {
    this.location.back();
  }

  public calculosPedido(pedido: Pedido): void {
    pedido.total = 0;
    pedido.numArticulos = 0;

    pedido.pedidoLineaSugerencias.forEach(element => {
      pedido.numArticulos = pedido.numArticulos + element.cantidad;
      pedido.total = pedido.total + (element.cantidad * element.sugerencia.precio);
    });

    pedido.pedidoLineaMenus.forEach(element => {
      pedido.numArticulos = pedido.numArticulos + element.cantidad;
      pedido.total = pedido.total + (element.cantidad * element.menu.precio);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.observ$ != null && !this.observ$.closed) {
      console.log('haciendo : this.observ$.unsubscribe()');
      this.observ$.unsubscribe();
    } else {
      console.log('No necesario hacer: this.observ$.unsubscribe()');
    }
  }

}
