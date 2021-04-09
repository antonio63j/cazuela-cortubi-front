import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription, throwError } from 'rxjs';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Pedido, PedidoLineaSugerencia } from '../../shared/modelos/pedido';
import { Sugerencia } from '../../shared/modelos/sugerencia';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { EstadoPedidoEnum } from '../../shared/modelos/pedido';
import swal from 'sweetalert2';

// Con la finalización con éxisto de login, se solicita carga de pedido (estado DESARROLLO)
// y si no hubiese pedido, dejamos pedido = null
// Con la finalización con éxisto de logout, pedido = null

@Injectable({
  providedIn: 'root'
})
export class CarritoService implements OnDestroy {
  public pedido: Pedido = null;

  public erroresValidacion: string[];
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject();

  constructor(
    public authService: AuthService,
    private http: HttpClient

  ) {

  }

  getPedido(): Pedido {
    if (this.pedido === null) {
      this.pedido = new Pedido();
      this.pedido.total = 0;
      this.pedido.numArticulos = 0;
      this.pedido.estadoPedido = EstadoPedidoEnum.creacion;
      this.pedido.usuario = this.authService.usuario.username;
    }
    return this.pedido;
  }

  // llamado por app.component con cada arranque de la app.
  cargaPedido(): void {
    if (this.authService.isAuthenticated()) {

      this.get()
        .pipe(
          takeUntil(this.unsubscribe$),
          tap((response: any) => {
            // console.log(response);
          })
        )
        .subscribe(
          response => {
            if (response == null) {
              this.pedido = response;
              console.log('pedido = null');

            } else {
              this.pedido = response.data;
              console.log('pedido:');
              console.log(this.pedido);
            }
          },
          err => {
            console.log(err);
            swal.fire('Error carga de pedido', err.status, 'error');
          }
        );

    }
  }

  // busca en pedido la sugerencia y asigna esa cantidad
  setSugerenciaCantidad(
    sugerencia: Sugerencia,
    cantidad: number): void {

    let index: number;
    const pedidoLineaSugerencia: PedidoLineaSugerencia = new PedidoLineaSugerencia();

    pedidoLineaSugerencia.sugerencia.id = sugerencia.id;
    pedidoLineaSugerencia.sugerencia.precio = sugerencia.precio;
    pedidoLineaSugerencia.cantidad = cantidad;

    index = this.getPedido().pedidoLineaSugerencias.findIndex(item => item.sugerencia.id === sugerencia.id);
    if (index > -1) {
      this.getPedido().pedidoLineaSugerencias[index] = pedidoLineaSugerencia;
    } else {
      this.getPedido().pedidoLineaSugerencias.push(pedidoLineaSugerencia);
    }
    console.log('pedido=');
    console.log(this.pedido);

    this.erroresValidacion = [];
    this.observ$ = this.save(this.pedido).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          this.pedido = json.data;
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

  save(pedido: Pedido): Observable<any> {
    return this.http.post<Pedido>(environment.urlEndPoint + '/api/pedido/save', pedido).pipe(
      catchError(err => {
        console.log(`error capturado: ${err.status} `);
        return throwError(err);
      })
    );
  }

  get(): Observable<any> {
    let parametros = new HttpParams();
    parametros = parametros.append('usuario', this.authService.usuario.username);

    return this.http.get<Pedido>(environment.urlEndPoint + '/api/pedido/usuario',
      { params: parametros }).pipe(
        catchError(err => {
          console.log(`error capturado: ${err.status} `);
          return throwError(err);
        })
      );
  }

  getNumProductos(): number {
    return this.pedido.numArticulos;
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy (), realizando unsubscribes');
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
