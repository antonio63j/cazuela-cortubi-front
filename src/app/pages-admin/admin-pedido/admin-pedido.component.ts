import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { AdminSugerenciaService } from 'src/app/pages-admin/admin-sugerencia/admin-sugerencia.service';
import { DynamicFormComponent } from 'src/app/shared/componentes/filtro/dynamic-form/dynamic-form.component';
import { FieldConfig, OpcionesSelect } from 'src/app/shared/componentes/filtro/field.interface';
import { Validators } from '@angular/forms';
import { FiltroPedido } from 'src/app/shared/modelos/filtro-pedido';
import { ModalConModeloService } from 'src/app/shared/services/modal-con-modelo.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';
import { EstadoPedidoEnum, Pedido } from 'src/app/shared/modelos/pedido';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { AdminPedidoService } from './admin-pedido.service';

registerLocaleData(localeEs, 'es');


const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
    allowOutsideClick: false
});



@Component({
    selector: 'app-admin-pedido',
    templateUrl: './admin-pedido.component.html',
    styleUrls: ['./admin-pedido.component.scss']
})

export class AdminPedidoComponent implements OnInit, OnDestroy {

    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    pedidos: Pedido[];
    pedido: Pedido = new Pedido();


    host: string = environment.urlEndPoint;
    private unsubscribe$ = new Subject();
    public paginador: any;

    public filterChecked = false;
    public filtroPedido: FiltroPedido = new FiltroPedido();

    public disable = true;

    regConfig: FieldConfig[];

    public opcionesOrdenacion: OpcionesSelect[];
    public sentidoOrdenacion: OpcionesSelect[];
    public opcionesEstado: OpcionesSelect[];


    constructor(
        private pedidoService: AdminPedidoService,
        private modalConModeloService: ModalConModeloService,
        private modalService: ModalService,
        private translate: TranslateService,
        private authService: AuthService,

    ) {

        this.opcionesEstado = [{ value: null, viewValue: 'sin filtro' }]
            .concat(Object.keys(EstadoPedidoEnum).map(key => {
                return {
                    value: key,
                    viewValue: EstadoPedidoEnum[key],
                };
            }));

        this.opcionesOrdenacion = [
            { value: 'estadoPedido', viewValue: 'Estado del pedido' },
            { value: 'fechaRegistro', viewValue: 'Fecha de registro' },
            { value: 'fechaRecogida', viewValue: 'Fecha de recogida' },
            { value: 'usuario', viewValue: 'Cuenta cliente' },
        ];

        this.sentidoOrdenacion = [
            { value: 'asc', viewValue: 'Ascendente' },
            { value: 'desc', viewValue: 'Descendente' }
        ];

        this.regConfig = [
            {
                type: 'daterange',
                label: 'Rango registro pedido',
                nameIni: 'diaRegistroIni',
                nameFin: 'diaRegistroFin',
                valueIni: null,
                valueFin: null,

                class: 'demo-10-width',
                validations: [
                ]
            },
            {
                type: 'select',
                label: 'Estado',
                name: 'estado',
                value: null,
                class: 'demo-15-width',
                options: this.opcionesEstado,
                validations: [
                ]
            },

            {
                type: 'daterange',
                label: 'Rango recogida pedido',
                nameIni: 'diaRecogidaIni',
                nameFin: 'diaRecogidaFin',
                valueIni: null,
                valueFin: null,
                class: 'demo-10-width',
                validations: [
                ]
            },
            {
                type: 'input',
                label: 'Cuenta cliente',
                inputType: 'text',
                class: 'demo-20-width',
                name: 'usuario',
                validations: [
                ]
            },
            {
                type: 'select',
                label: 'Ordenación',
                name: 'ordenacion',
                class: 'campoOrdenacion',
                value: 'fechaRecogida',
                options: this.opcionesOrdenacion,
                validations: [
                ]
            },
            {
                type: 'select',
                label: 'sentido Ordenación',
                name: 'sentidoOrdenacion',
                class: 'sentidoOrdenacion',
                value: 'asc',
                options: this.sentidoOrdenacion,
                validations: [
                ]
            },

            {
                type: 'button',
                label: 'Aplicar filtros y ordenación'
            }
        ];


    }

    ngOnInit(): void {
        this.nuevaPagina(0);
        // this.subscripcioneventoCerrarModalScrollable();

    }

    // Es llamado por el paginator
    public getPagina(paginaYSize: any): void {
        const pagina: number = paginaYSize.pagina;
        const size: number = paginaYSize.size;
        this.filtroPedido.size = size.toString();
        this.nuevaPagina(pagina);
    }

    nuevaPagina(pagina: number): void {
        this.filtroPedido.page = pagina.toString();

        //     // test
        if (!this.filterChecked) {
            this.filtroPedido.init();
        }
        //     // test

        this.pedidoService
            .getPedidos(this.filtroPedido)
            .pipe(
                takeUntil(this.unsubscribe$),
                tap((response: any) => {
                })
            )
            .subscribe(
                response => {
                    console.log(`response: ${JSON.stringify(response)}`);

                    this.pedidos = response.content as Pedido[];
                    this.paginador = response;
                    window.scrollTo(0, 0);
                },
                err => {
                    switch (err) {
                        case 400: {
                            console.log(`Errores de validacion: ${err.errores}`);
                            break;
                        }
                        case 401: {
                            swal.fire(`La sesión ha caducado, inicie sesión `, err.status, 'warning');
                            break;
                        }
                        case 501: {
                            console.log(`error en la peticion ${JSON.stringify(err)}`);
                            break;
                        }
                        default: {
                            swal.fire('Error carga de pedidos ', err.status, 'error');
                            console.log(err);
                            swal.fire(err.mensaje, '', 'error');
                            break;
                        }
                    }

                }
            );
    }

    // public cartaDetalle(sugerencia: Sugerencia): void {
    //     this.modalConModeloService.openModalScrollable(
    //         CartaDetalleComponent,
    //         { size: 'lg', backdrop: 'static', scrollable: true },
    //         sugerencia,
    //         'sugerencia',
    //         'Los campos con * son obligatorios',
    //         'Datos del sugerencia'
    //     ).pipe(
    //         take(1) // take() manages unsubscription for us
    //     ).subscribe(result => {
    //         console.log({ confirmedResult: result });
    //         this.sugerenciaService.getSugerencias(this.filtroPedido).subscribe(respon => {
    //             this.sugerencias = respon.content as Sugerencia[];
    //             this.paginador = respon;
    //         });
    //     });
    // }


    subscripcioneventoCerrarModalScrollable(): void {
        this.modalService.eventoCerrarModalScrollable.pipe(
            takeUntil(this.unsubscribe$),
        ).subscribe(
            () => {
                console.log('recibido evento para cerrar modal');
                this.modalConModeloService.closeModalScrollable();
            }
        );
    }

    // subscripcioneventoNotificacionUpload(): void {
    //     this.modalService.eventoNotificacionUpload.pipe(
    //         takeUntil(this.unsubscribe$),
    //     ).subscribe(
    //         sugerencia => {
    //             console.log('recibido evento fin Upload');
    //             this.sugerencias.map(sugerenciaOriginal => {
    //                 if (sugerenciaOriginal.id === sugerencia.id) {
    //                     sugerenciaOriginal.imgFileName = sugerencia.imgFileName;
    //                 }
    //                 return sugerenciaOriginal;
    //             }); // map
    //         }
    //     );
    // }

    changedFilter(): void {
        if (this.filterChecked) {
            //     this.nuevaPagina(0);
            console.log('filterChecked');
        } else {
            this.filtroPedido.init();
            this.nuevaPagina(0);
        }
    }

    quitarFiltros(): void {
        this.filtroPedido.init();
        this.filterChecked = !this.filterChecked;
        this.nuevaPagina(0);
    }

    submit(value: any): void {
        // this.filtroPedido.label = value.label;
        // this.filtroPedido.tipo = value.tipo;
        // this.filtroPedido.precioMin = value.precioMin;
        // this.filtroPedido.precioMax = value.precioMax;
        this.filtroPedido.order = value.ordenacion;
        this.filtroPedido.direction = value.sentidoOrdenacion;

        this.filtroPedido.estado = value.estado;
        this.filtroPedido.diaRegistroIni = value.diaRegistroIni;
        this.filtroPedido.diaRegistroFin = value.diaRegistroFin;
        this.filtroPedido.diaRecogidaIni = value.diaRecogidaIni;
        this.filtroPedido.diaRecogidaFin = value.diaRecogidaFin;
        this.filtroPedido.usuario = value.usuario;

        console.log(`filtroPedido: ${JSON.stringify(this.filtroPedido)}`);
        console.log(`value: ${JSON.stringify(value)}`);

        this.nuevaPagina(0);
    }

    ngOnDestroy(): void {
        console.log('realizando unsubscribes');
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
