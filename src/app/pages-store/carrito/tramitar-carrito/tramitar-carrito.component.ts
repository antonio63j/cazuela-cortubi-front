import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { NgxTimepickerFieldComponent } from 'ngx-material-timepicker';
import * as mySettings from '../../../shared/settings/ngx-material-timepicker';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PedidoConfirmacion } from '../../../shared/modelos/pedido-confirmacion';
import { CarritoService } from '../carrito.service';

const swalWithBootstrapButtons = swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
  allowOutsideClick: false
});

@Component({
  selector: 'app-tramitar-carrito',
  templateUrl: './tramitar-carrito.component.html',
  styleUrls: ['./tramitar-carrito.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class TramitarCarritoComponent implements OnInit, OnDestroy {

  @Output() solicitarTramitarCarrito = new EventEmitter<PedidoConfirmacion>();

  private subscriptionParams$: Subscription = null;
  private unsubscribe$ = new Subject();

  private idCarrito: number;
  public horaApertura = '09:00';
  public horaCierre = '22:35';
  public horasHacerPedido = 2;
  public diasRecogidaPedido = 4;

  public hoy: Date = new Date();
  public minDate: Date = new Date();
  public maxDate: Date = new Date();
  public chosenDate: Date;

  public minTimeD: Date;
  public minTime = '00:00';
  public maxTime = '23:59';
  public chosenTime: string;

  public oktTheme = mySettings.timeSettings;
  private pedidoConfirmacion: PedidoConfirmacion = new PedidoConfirmacion();
  public nota: string;

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return (date === 1 || date === 28) ? 'example-custom-date-class' : '';
    }

    return '';
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private carritoService: CarritoService
  ) {
    // this.getDatePropuesta();
    this.chosenDate = new Date();
    this.SetPropuestas(new Date());

    this.minDate.setDate(this.chosenDate.getDate());
    this.maxDate.setDate(this.chosenDate.getDate() + this.diasRecogidaPedido);
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
    this.idCarrito = params.idCarrito; // o +params.get('tipo');
  }


  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) { s = '0' + s; }
    return s;
  }

  offsetHora(hora: string, offset: number): string {
    // hora debe tener formato hh:mm
    const h = (Number(hora.substr(0, 2)) + offset) % 24;
    return this.pad(h, 2) + ':' + hora.substr(3, 2);
  }

  SetPropuestas(hoyDate: Date): void {
    // Propone fecha y hora para recogida de pedido y actualiza las siguientes var globales
    // * this.chosenDate
    // * this.chosenTime

    const mananaDate = new Date(hoyDate.getFullYear(), hoyDate.getMonth(), hoyDate.getDate() + 1);

    const ha = this.horaApertura;
    const hc = this.horaCierre;

    const hxDate = new Date(hoyDate.getFullYear(), hoyDate.getMonth(), hoyDate.getDate(),
      hoyDate.getHours(), hoyDate.getMinutes());

    const hx = this.pad(hoyDate.getHours(), 2) + ':' + this.pad(hoyDate.getMinutes(), 2);

    const offSetPedido = hoyDate.getHours() + this.horasHacerPedido;
    const hp = this.pad(offSetPedido, 2) + ':' + this.pad(hoyDate.getMinutes(), 2);
    const hp24 = this.pad((offSetPedido % 24), 2) + ':' + this.pad(hoyDate.getMinutes(), 2);

    if (ha < hc) {
      if (hx < ha) {
        this.chosenDate = hoyDate;
        this.chosenTime = this.offsetHora(ha, this.horasHacerPedido);
        console.log('chosenTime:' + this.chosenTime);
        return;
      }

      if (hx < hc) {
        if (hp < hc) {
          this.chosenDate = hoyDate;
          this.chosenTime = hp;
        } else {
          this.chosenDate = mananaDate;
          this.chosenTime = this.offsetHora(ha, this.horasHacerPedido);
        }
        return;
      }
      if (hx < '24:00') {
        this.chosenDate = mananaDate;
        this.chosenTime = this.offsetHora(ha, this.horasHacerPedido);
        return;
      }
      console.error('caso no comtemplado');
    }

    if (ha === hc) {
      if (hp > '24:00') {
        this.chosenDate = mananaDate;
      } else {
        this.chosenDate = hoyDate;
      }
      this.chosenTime = hp;
      return;
    }

    if (ha > hc) {
      if (hx < hc) {
        if (hp < hc) {
          this.chosenDate = hoyDate;
          this.chosenTime = hp;
        } else {
          this.chosenDate = hoyDate;
          this.chosenTime = this.offsetHora(ha, this.horasHacerPedido);
        }
        return;
      }

      if (hx < ha) {
        this.chosenDate = hoyDate;
        this.chosenTime = this.offsetHora(ha, this.horasHacerPedido);
        return;
      }

      if (hx < '24:00') {
        if (hp < '24:00') {
          this.chosenDate = hoyDate;
          this.chosenTime = hp;
        } else {
          if (hp24 < hc) {
            this.chosenDate = hoyDate;
            this.chosenTime = hp24;
          } else {
            this.chosenDate = mananaDate;
            this.chosenTime = this.offsetHora(ha, this.horasHacerPedido);
          }
        }
        return;
      }
    }
    console.error('caso no comtemplado');
  }

  timeChanged(event: string): void {
    if (event >= this.minTime && event <= this.maxTime) {
      this.chosenTime = event;
    }
  }

  dateChanged(): void {
    if (this.chosenDate.getFullYear() === new Date().getFullYear() &&
      this.chosenDate.getMonth() === new Date().getMonth() &&
      this.chosenDate.getDate() === new Date().getDate()
    ) {
      const hoy: Date = new Date();
      this.chosenDate.setHours(hoy.getHours(), hoy.getMinutes());
    }

    console.log(`chosenDete pasa a : ${this.chosenDate}`);

    this.SetPropuestas(this.chosenDate);
  }

  confirmar(): void {

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: `Confimarás la recogida del pedido para el ${formatDate(this.chosenDate, 'dd/MM/YYYY', 'es-Es')} a las ${this.chosenTime}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        // this.pedidoConfirmacion.idCarrito = this.idCarrito;
        this.pedidoConfirmacion.fhRecogidaSolicitada = new Date(this.chosenDate);

        //  this.chosenDate.setHours(hoy.getHours(), hoy.getMinutes());
        this.pedidoConfirmacion.fhRecogidaSolicitada.setHours(+this.chosenTime.substr(0, 2),
          +this.chosenTime.substr(3, 2), 0);

        this.pedidoConfirmacion.nota = this.nota;

        console.log(`chosenDate: ${JSON.stringify(this.chosenDate)}`);
        console.log(`chosenTime: ${JSON.stringify(this.chosenTime)}`);
        console.log(`pedidoConfirmacion = ${JSON.stringify(this.pedidoConfirmacion)}`);
        console.log(`this.pedidoConfirmacion.fhRecogidaSolicitada: ${JSON.stringify(this.pedidoConfirmacion.fhRecogidaSolicitada)}`);

        this.solicitarTramitarCarrito.emit(this.pedidoConfirmacion);

        // this.carritoService.confirmar(this.pedidoConfirmacion).subscribe(
        //   response => {
        //     this.router.navigate(['/dashboard']);
        //   }
        //   , err => {
        //     switch (err) {
        //       case 400: {
        //          console.log(`Errores de validacion: ${err.errores}`);
        //          break;
        //       }
        //       case 501: {
        //          console.log(`error en la peticion ${JSON.stringify(err)}`);
        //          break;
        //       }
        //       default: {
        //         swal.fire(err.mensaje, '', 'error');
        //         break;
        //       }
        //    }
        //     console.log(err);
        //   }
        // );
      }
    });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy ()');
  }

}

