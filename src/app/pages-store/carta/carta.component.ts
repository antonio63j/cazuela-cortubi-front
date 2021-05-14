import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { AdminSugerenciaService } from 'src/app/pages-admin/admin-sugerencia/admin-sugerencia.service';
import { DynamicFormComponent } from 'src/app/shared/componentes/filtro/dynamic-form/dynamic-form.component';
import { FieldConfig, OpcionesSelect } from 'src/app/shared/componentes/filtro/field.interface';
import { Validators } from "@angular/forms";
import { FiltroSugerencia } from 'src/app/shared/modelos/filtro-sugerencia';
import { Sugerencia } from 'src/app/shared/modelos/sugerencia';
import { Tipoplato } from 'src/app/shared/modelos/tipoplato';
import { ModalConModeloService } from 'src/app/shared/services/modal-con-modelo.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ShareEmpresaService } from 'src/app/shared/services/share-empresa.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

import { CartaDetalleComponent } from './carta-detalle/carta-detalle.component';
import { CarritoService } from '../carrito/carrito.service';

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
    allowOutsideClick: false
});



@Component({
    selector: 'app-carta',
    templateUrl: './carta.component.html',
    styleUrls: ['./carta.component.scss']
})

export class CartaComponent implements OnInit, OnDestroy {

    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    sugerencias: Sugerencia[];
    sugerencia: Sugerencia = new Sugerencia();

    host: string = environment.urlEndPoint;
    private unsubscribe$ = new Subject();
    public paginador: any;

    public tipoPlatos: Tipoplato[];

    public filterChecked = false;
    public filtroSugerencia: FiltroSugerencia = new FiltroSugerencia();

    public disable = true;

    regConfig: FieldConfig[];

    public opcionesPlatos: OpcionesSelect[];
    public opcionesOrdenacion: OpcionesSelect[];
    public sentidoOrdenacion: OpcionesSelect[];

    constructor(
        private sugerenciaService: AdminSugerenciaService,
        private shareEmpresaService: ShareEmpresaService,
        private modalConModeloService: ModalConModeloService,
        private modalService: ModalService,
        private translate: TranslateService,
        private authService: AuthService,
        private carritoService: CarritoService

    ) {
        this.filtroSugerencia.setSoloVisibles();
        this.sugerencias = [];
        this.tipoPlatos = this.shareEmpresaService.getIipoplatosInMem();

        this.opcionesPlatos = [{ value: null, viewValue: 'sin filtro' }].concat(this.tipoPlatos.map(item => ({
            value: item.nombre, viewValue: item.nombre
        })
        ));

        this.opcionesOrdenacion = [
            { value: 'label', viewValue: 'Nombre' },
            { value: 'tipo', viewValue: 'Tipo Plato' },
            { value: 'precio', viewValue: 'Precio' },
        ];

        this.sentidoOrdenacion = [
            { value: 'asc', viewValue: 'Ascendente' },
            { value: 'desc', viewValue: 'Descendente' }
        ];

        this.regConfig = [
            {
                type: 'input',
                label: 'Nombre',
                inputType: 'text',
                class: 'demo-15-width',
                name: 'label',
                validations: [
                ]
            },
            {
                type: 'select',
                label: 'Tipo plato',
                name: 'tipo',
                value: null,
                class: 'demo-15-width',
                options: this.opcionesPlatos,
                validations: [
                ]
            },
            {
                type: 'input',
                label: 'Precio mim.',
                class: 'demo-10-width',
                inputType: 'number',
                name: 'precioMin',
                validations: [
                ]
            },
            {
                type: 'input',
                label: 'Precio max.',
                class: 'demo-10-width',
                inputType: 'number',
                name: 'precioMax',
                validations: [
                ]
            },
            {
                type: 'select',
                label: 'Ordenación',
                name: 'ordenacion',
                class: 'campoOrdenacion',
                value: 'label',
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
        this.subscripcioneventoCerrarModalScrollable();

        // Suponemos que el servicio es singleton por lo que no hay que 
        // invocar a cargaCarrito()
        // this.carritoService.cargaCarrito();
    }

    // Es llamado por el paginator
    public getPagina(paginaYSize: any): void {
        const pagina: number = paginaYSize.pagina;
        const size: number = paginaYSize.size;
        this.filtroSugerencia.size = size.toString();
        this.nuevaPagina(pagina);
    }

    nuevaPagina(pagina: number): void {
        this.filtroSugerencia.page = pagina.toString();

        // test
        if (!this.filterChecked) {
            this.filtroSugerencia.init();
        }
        // test

        this.sugerenciaService
            .getSugerencias(this.filtroSugerencia)
            .pipe(
                takeUntil(this.unsubscribe$),
                tap((response: any) => {
                })
            )
            .subscribe(
                response => {
                    this.sugerencias = response.content as Sugerencia[];
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
                            swal.fire('Error carga de sugerencias ', err.status, 'error');
                            console.log(err);
                            swal.fire(err.mensaje, '', 'error');
                            break;
                        }
                    }

                }
            );
    }

    public cartaDetalle(sugerencia: Sugerencia): void {
        this.modalConModeloService.openModalScrollable(
            CartaDetalleComponent,
            { size: 'lg', backdrop: 'static', scrollable: true },
            sugerencia,
            'sugerencia',
            'Los campos con * son obligatorios',
            'Datos del sugerencia'
        ).pipe(
            take(1) // take() manages unsubscription for us
        ).subscribe(result => {
            console.log({ confirmedResult: result });
            this.sugerenciaService.getSugerencias(this.filtroSugerencia).subscribe(respon => {
                this.sugerencias = respon.content as Sugerencia[];
                this.paginador = respon;
            });
        });
    }

    public comprar(sugerencia: Sugerencia): void {
        this.cartaDetalle(sugerencia);
    }

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

    subscripcioneventoNotificacionUpload(): void {
        this.modalService.eventoNotificacionUpload.pipe(
            takeUntil(this.unsubscribe$),
        ).subscribe(
            sugerencia => {
                console.log('recibido evento fin Upload');
                this.sugerencias.map(sugerenciaOriginal => {
                    if (sugerenciaOriginal.id === sugerencia.id) {
                        sugerenciaOriginal.imgFileName = sugerencia.imgFileName;
                    }
                    return sugerenciaOriginal;
                }); // map
            }
        );
    }

    changedFilter(): void {
        if (this.filterChecked) {
            //     this.nuevaPagina(0);
        } else {
            this.filtroSugerencia.init();
            this.nuevaPagina(0);
        }
    }

    quitarFiltros(): void {
        this.filtroSugerencia.init();
        this.filterChecked = !this.filterChecked;
        this.nuevaPagina(0);
    }

    submit(value: any): void {
        this.filtroSugerencia.label = value.label;
        this.filtroSugerencia.tipo = value.tipo;
        this.filtroSugerencia.precioMin = value.precioMin;
        this.filtroSugerencia.precioMax = value.precioMax;
        this.filtroSugerencia.order = value.ordenacion;
        this.filtroSugerencia.direction = value.sentidoOrdenacion;
        this.nuevaPagina(0);
    }

    ngOnDestroy(): void {
        console.log('realizando unsubscribes');
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}


