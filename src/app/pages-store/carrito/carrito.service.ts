import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription, throwError } from 'rxjs';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Pedido, PedidoLineaMenu, PedidoLineaSugerencia } from '../../shared/modelos/pedido';
import { Sugerencia } from '../../shared/modelos/sugerencia';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { EstadoPedidoEnum } from '../../shared/modelos/pedido';
import swal from 'sweetalert2';
import { LoginComponent } from 'src/app/usuarios/login/login.component';
import { LoadingComponent } from 'src/app/shared/componentes/loading/loading.component';

// Este servicio deberá tener el carrito actualizado reflejando cambios de desde carta-component,
// menu-component y carrito-componet. Carrito-component deberá tener tambien tener una 
// copia actualizada, para ello debe hacer carga inicial del carrito y actualizaciones cuando
// realice actualizaciones o deletes de PedidoLineaSugerencia o PedidoLineaMenu.

// Con la finalización con éxisto de login, se solicita carga de carrito (cargaCarrito)
// con la finalidad de que se mande mensaje a los subcriptores del
// numero de articulos en carrito

@Injectable({
  providedIn: 'root'
})
export class CarritoService implements OnDestroy {
  public carrito: Pedido;
  public erroresValidacion: string[];
  public observ$: Subscription = null;
  private unsubscribe$ = new Subject();

  private numArticulosCarritoMsg = new ReplaySubject<number>();

  constructor(
    public authService: AuthService,
    private http: HttpClient

  ) {
    // test
    console.log('arranque servicio, username: ---------------------------');
    console.log(this.authService.usuario.username);

    this.carrito = new Pedido(this.authService.usuario.username);
    this.inicializaCarrito(this.carrito);

    // para notificar a subscriptores del carrito (header.component)
    this.carrito = this.cargaCarrito();
  }

  public inicializaCarrito(carrito: Pedido): void {
    carrito.estadoPedido = EstadoPedidoEnum.creacion;
    carrito.total = 0;
    carrito.numArticulos = 0;
    carrito.pedidoLineaSugerencias = [];
    carrito.pedidoLineaMenus = [];
  }


  // devuelve observable para que HeaderComponer pueda subscribirse
  getNumArticulosCarritoMsg(): Observable<number> {
    return this.numArticulosCarritoMsg as Observable<number>;
  }

  sendNumArticulosCarritoMsg(numArticulos: number): void {
    console.log('publicando cambios del carrito');
    this.numArticulosCarritoMsg.next(numArticulos);
  }

  // clientes conocidos: carrito.component
  copiaCarrito(): Pedido {
    return this.carrito;
  }

  // llamado por app.component con cada arranque de la app. y
  // login-modal-component
  cargaCarrito(): Pedido {
    if (!this.authService.isAuthenticated()) {
      return this.carrito;
    }
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
            this.inicializaCarrito(this.carrito);
            console.log('carrito = null');
          } else {
            this.carrito = response.data;
            console.log('carrito:');
            console.log(this.carrito);
          }
          this.sendNumArticulosCarritoMsg(this.carrito.numArticulos);
        },
        err => {
          console.log(err);
          swal.fire('Error carga de carrito', err.status, 'error');
        }
      );
    return this.carrito;
  }

  private actualizarLineaSugerenciaEnCarrito(
    carrito: Pedido,
    pedidoLineaSugerencia: PedidoLineaSugerencia): void {

    let index: number;
    index = carrito.pedidoLineaSugerencias.findIndex(item => item.sugerencia.id === pedidoLineaSugerencia.sugerencia.id);
    if (index > -1) {
      carrito.pedidoLineaSugerencias[index] = pedidoLineaSugerencia;
    } else {
      carrito.pedidoLineaSugerencias.push(pedidoLineaSugerencia);
    }
  }

  private actualizarLineaMenuEnCarrito(
    carrito: Pedido,
    pedidoLineaMenu: PedidoLineaMenu): void {

    console.log('pedidoLineaMenu:');
    console.log(pedidoLineaMenu);

    let index: number;
    index = carrito.pedidoLineaMenus.findIndex(
      item => item.menu.id === pedidoLineaMenu.menu.id &&
        item.primero.id === pedidoLineaMenu.primero.id &&
        item.segundo.id === pedidoLineaMenu.segundo.id &&
        item.postre.id === pedidoLineaMenu.postre.id);
    if (index > -1) {
      carrito.pedidoLineaMenus[index] = pedidoLineaMenu;
    } else {
      carrito.pedidoLineaMenus.push(pedidoLineaMenu);
    }
  }

  // llamado desde carta-detalle.component
  addPedidoLineaSugerencia(pedidoLineaSugerencia: PedidoLineaSugerencia): void {
    this.actualizarLineaSugerenciaEnCarrito(this.carrito, pedidoLineaSugerencia);
    this.saveCarrito();
  }

  // llamado desde menu-detalle.component
  addPedidoLineaMenu(pedidoLineaMenu: PedidoLineaMenu): void {
    this.actualizarLineaMenuEnCarrito(this.carrito, pedidoLineaMenu);
    this.saveCarrito();
  }

  saveCarrito(): void {
    this.erroresValidacion = [];

    this.carrito.usuario = this.authService.usuario.username;

    this.observ$ = this.save(this.carrito).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.carrito = json.data;
          this.sendNumArticulosCarritoMsg(this.carrito.numArticulos);
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

  // llamado desde carrito-component
  saveLineaSugerencia(pedidoLineaSugerencia: PedidoLineaSugerencia): Observable<any> {
    this.actualizarLineaSugerenciaEnCarrito(this.carrito, pedidoLineaSugerencia);
    return this.save(this.carrito).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }

  // llamado desde carrito-component
  saveLineaMenu(pedidoLineaMenu: PedidoLineaMenu): Observable<any> {
    this.actualizarLineaMenuEnCarrito(this.carrito, pedidoLineaMenu);
    return this.save(this.carrito).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }

  save(carrito: Pedido): Observable<any> {
    return this.http.post<Pedido>(environment.urlEndPoint + '/api/pedido/save', carrito).pipe(
      catchError(err => {
        console.log(`error capturado: ${err.status} `);
        return throwError(err);
      }), map((response: any) => {
        (response.data.pedidoLineaSugerencias.sort((a, b) => {
          return a.sugerencia.label < b.sugerencia.label ? -1 : 1;
        }
        ));

        (response.data.pedidoLineaMenus.sort((a, b) => {
          return a.menu.label.localeCompare(b.menu.label) || b.id - a.id;
        }
        ));
        this.carrito = response.data;
        this.sendNumArticulosCarritoMsg(this.carrito.numArticulos);
        return response;

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
        }), map((response: any) => {
          if (response === null) {
            return response;
          }
          (response.data.pedidoLineaSugerencias.sort((a, b) => {
            return a.sugerencia.label < b.sugerencia.label ? -1 : 1;
          }
          ));
          (response.data.pedidoLineaMenus.sort((a, b) => {
            return a.menu.label.localeCompare(b.menu.label) || b.id - a.id;
          }
          ));
          return response;
        })
      );
  }

  deleteLineaSugerencia(idPedido: number, idLineaSugerencia: number): Observable<any> {
    let parametros = new HttpParams();
    parametros = parametros.append('idPedido', idPedido.toString());
    parametros = parametros.append('idLineaSugerencia', idLineaSugerencia.toString());

    return this.http.delete<Pedido>(environment.urlEndPoint + '/api/pedido/lineaSugerencia',
      { params: parametros }).pipe(
        catchError(err => {
          console.log(`error capturado: ${err.status} `);
          return throwError(err);
        }), map((response: any) => {
          if (response === null) {
            return response;
          }
          (response.data.pedidoLineaSugerencias.sort((a, b) => {
            return a.sugerencia.label < b.sugerencia.label ? -1 : 1;
          }
          ));
          (response.data.pedidoLineaMenus.sort((a, b) => {
            return a.menu.label.localeCompare(b.menu.label) || b.id - a.id;
          }
          ));
          this.carrito = response.data;
          this.sendNumArticulosCarritoMsg(this.carrito.numArticulos);
          return response;
        })
      );

  }

  deleteLineaMenu(idPedido: number, idLineaMenu: number): Observable<any> {
    let parametros = new HttpParams();
    parametros = parametros.append('idPedido', idPedido.toString());
    parametros = parametros.append('idLineaMenu', idLineaMenu.toString());

    return this.http.delete<Pedido>(environment.urlEndPoint + '/api/pedido/lineaMenu',
      { params: parametros }).pipe(
        catchError(err => {
          console.log(`error capturado: ${err.status} `);
          return throwError(err);
        }), map((response: any) => {
          if (response === null) {
            return response;
          }
          (response.data.pedidoLineaSugerencias.sort((a, b) => {
            return a.sugerencia.label < b.sugerencia.label ? -1 : 1;
          }
          ));
          (response.data.pedidoLineaMenus.sort((a, b) => {
            return a.menu.label.localeCompare(b.menu.label) || b.id - a.id;
          }
          ));
          this.carrito = response.data;
          this.sendNumArticulosCarritoMsg(this.carrito.numArticulos);
          return response;
        })
      );

  }

  public getTotal(): number {
    return this.carrito.total;
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
