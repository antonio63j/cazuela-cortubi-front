import { Component, OnDestroy, OnInit } from '@angular/core';
import { Pedido, PedidoLineaSugerencia, CantidadesOpciones, PedidoLineaMenu } from 'src/app/shared/modelos/pedido';
import { environment } from 'src/environments/environment';
import { CarritoService } from './carrito.service';
import { registerLocaleData } from '@angular/common';
import swal from 'sweetalert2';

import localeEs from '@angular/common/locales/es';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/usuarios/auth.service';
registerLocaleData(localeEs, 'es');


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit, OnDestroy {

  // public carrito: Pedido = new Pedido(this.authService.usuario.username);
  carrito: Pedido;
  host: string = environment.urlEndPoint;
  public erroresValidacion: string[];
  public observ$: Subscription = null;
  public observSugerencia$: Subscription = null;
  public observMenu$: Subscription = null;

  private unsubscribe$ = new Subject();
  public cantidades: number[] = CantidadesOpciones.cantidades;

  constructor(
    public carritoService: CarritoService,
    private authService: AuthService
  ) {
       this.carrito = this.carritoService.copiaCarrito();
  }

  ngOnInit(): void {
   // this.get();
  }



  cambioCantidadSugerencia(pedidoLineaSugerencia: PedidoLineaSugerencia): void {
    this.observSugerencia$ = this.carritoService.saveLineaSugerencia(pedidoLineaSugerencia).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.carrito = json.data;
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
            swal.fire('Error en validación de datos ', `error.status = ${err.status.toString()}`, 'error');

          } else {
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error al añadir al carrito ', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }



  cambioCantidadMenu(pedidoLineaMenu: PedidoLineaMenu): void {
    this.observMenu$ = this.carritoService.saveLineaMenu(pedidoLineaMenu).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.carrito = json.data;
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
            swal.fire('Error en validación de datos ', `error.status = ${err.status.toString()}`, 'error');

          } else {
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error al añadir al carrito ', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  deleteLineaSugerencia(lineaSugerencia: PedidoLineaSugerencia): void {
    // el servicio debe devolver el pedido
    this.erroresValidacion = [];
    this.observ$ = this.carritoService.deleteLineaSugerencia(this.carrito.id, lineaSugerencia.id).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        response => {
          if (response == null) {
            this.carritoService.inicializaCarrito(this.carrito);
            console.log('carrito = null');
          } else {
            this.carrito = response.data;
            console.log('carrito:');
            console.log(this.carrito);
          }
          this.carritoService.sendNumArticulosCarritoMsg(this.carrito.numArticulos);
        },
        err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
            swal.fire('Error al eliminar articulo de carrito', `error.status = ${err.status.toString()}`, 'error');

          } else {
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error al añadir al carrito ', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );

  }

  deleteLineaMenu(lineaMenu: PedidoLineaMenu): void {
    // el servicio debe devolver el pedido
    this.erroresValidacion = [];
    this.observ$ = this.carritoService.deleteLineaMenu(this.carrito.id, lineaMenu.id).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        response => {
          if (response == null) {
            this.carritoService.inicializaCarrito(this.carrito);
            console.log('carrito = null');
          } else {
            this.carrito = response.data;
            console.log('carrito:');
            console.log(this.carrito);
          }
          this.carritoService.sendNumArticulosCarritoMsg(this.carrito.numArticulos);
        },
        err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
            swal.fire('Error en validación de datos ', `error.status = ${err.status.toString()}`, 'error');

          } else {
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error al eliminar articulo del carrito ', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );

  }

 // LLamadas al servicio:
// save ---------------------------

  save(): void {
    this.erroresValidacion = [];
    this.observ$ = this.carritoService.save(this.carrito).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        response => {
          if (response == null) {
            this.carritoService.inicializaCarrito(this.carrito);
            console.log('carrito = null');
          } else {
            this.carrito = response.data;
            console.log('carrito:');
            console.log(this.carrito);
          }
          this.carritoService.sendNumArticulosCarritoMsg(this.carrito.numArticulos);
        },
        err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
            swal.fire('Error en validación de datos ', `error.status = ${err.status.toString()}`, 'error');

          } else {
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error al añadir al carrito ', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  get(): void {
    if (this.authService.isAuthenticated()) {

      this.carritoService.get()
        .pipe(
          takeUntil(this.unsubscribe$),
          tap((response: any) => {
            // console.log(response);
          })
        )
        .subscribe(
          response => {
            if (response == null) {
              this.carritoService.inicializaCarrito(this.carrito);
              console.log('carrito = null');

            } else {
              this.carrito = response.data;
              console.log('carrito:');
              console.log(this.carrito);
            }
          },
          err => {
            console.log(err);
            swal.fire('Error carga de carrito', err.status, 'error');
          }
        );
    }
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy (), realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.observMenu$ != null && !this.observMenu$.closed) {
      console.log('haciendo : this.observMenu$.unsubscribe()');
      this.observMenu$.unsubscribe();
    } else {
      console.log('No necesario hacer: this.observMenu$.unsubscribe()');
    }

    if (this.observSugerencia$ != null && !this.observSugerencia$.closed) {
      console.log('haciendo : this.observSugerencia$.unsubscribe()');
      this.observSugerencia$.unsubscribe();
    } else {
      console.log('No necesario hacer: this.observSugerencia$.unsubscribe()');
    }
  }

}
