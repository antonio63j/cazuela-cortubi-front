import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap, take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

import { Sugerencia } from '../../shared/modelos/sugerencia';

import { AdminSugerenciaService } from './admin-sugerencia.service';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { ModalService } from '../../shared/services/modal.service';
// import { SugerenciaFormComponent } from './sugerencia-form/sugerencia-form.component';

// ant
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../usuarios/auth.service';
import { SugerenciaFormComponent } from './sugerencia-form/sugerencia-form.component';
import { environment } from 'src/environments/environment';
import { Tipoplato } from 'src/app/shared/modelos/tipoplato';
import { ShareEmpresaService } from 'src/app/shared/services/share-empresa.service';
import { FiltroSugerencia } from 'src/app/shared/modelos/filtro-sugerencia';
import { HttpParams } from '@angular/common/http';

// import { debug } from 'util';

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
    allowOutsideClick: false
});

@Component({
    selector: 'app-sugerencias',
    templateUrl: './admin-sugerencia.component.html',
    styleUrls: ['./admin-sugerencia.component.scss'],
    animations: [routerTransition()],
    // providers: [SugerenciasService]
})

export class AdminSugerenciaComponent implements OnInit, OnDestroy {
    sugerencias: Sugerencia[];
    sugerencia: Sugerencia = new Sugerencia();
    // private pagina: number;
    host: string = environment.urlEndPoint;
    private unsubscribe$ = new Subject();
    public paginador: any;

    public tipoPlatos: Tipoplato[];

    public filterChecked = false;
    public filtroSugerencia: FiltroSugerencia = new FiltroSugerencia();

    constructor(
        private sugerenciaService: AdminSugerenciaService,
        private shareEmpresaService: ShareEmpresaService,
        private modalConModeloService: ModalConModeloService,
        private modalService: ModalService,
        private translate: TranslateService,
        private authService: AuthService

    ) {
        this.sugerencias = [];
        this.tipoPlatos = this.shareEmpresaService.getIipoplatosInMem();
    }

    ngOnInit(): void {
        this.nuevaPagina(0);
        this.subscripcioneventoCerrarModalScrollable();
    }

    // Es llamado por el paginator
    public getPagina(pagina: number): void {
        this.nuevaPagina(pagina);
    }

    nuevaPagina(pagina: number): void {
        // this.pagina = pagina;
        this.filtroSugerencia.page = pagina.toString();
        this.sugerenciaService
            .getSugerencias(this.filtroSugerencia)
            .pipe(
                takeUntil(this.unsubscribe$),
                tap((response: any) => {
                    // console.log(response);
                }),
                map((response: any) => {
                    (response.content as Sugerencia[]).map(sugerencia => {
                        sugerencia.label = sugerencia.label.toUpperCase();
                        return sugerencia;
                    });
                    return response;
                })
            )
            .subscribe(
                response => {
                    this.sugerencias = response.content as Sugerencia[];
                    this.paginador = response;
                },
                err => {
                    console.log(err);
                    swal.fire('Error carga de sugerencias ', err.status, 'error');
                }
            );
    }

    public crear(): void {

        this.modalConModeloService.openModalScrollable(
            SugerenciaFormComponent,
            { size: 'lg', backdrop: 'static', scrollable: true },
            this.sugerencia,
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

    public update(sugerencia: Sugerencia): void {
        this.modalConModeloService.openModalScrollable(
            SugerenciaFormComponent,
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

    delete(sugerencia: Sugerencia): void {
        swalWithBootstrapButtons.fire({
            title: '¿Estás seguro?',
            text: `Eliminarás el sugerencia ${sugerencia.label}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                this.sugerenciaService.delete(sugerencia).subscribe(
                    response => {
                        if (this.paginador.numberOfElements === 1) {
                            // this.pagina = 0;
                            this.filtroSugerencia.page = '0';
                        }
                        this.sugerenciaService.getSugerencias(this.filtroSugerencia).subscribe(respon => {
                            this.sugerencias = respon.content as Sugerencia[];
                            this.paginador = respon;
                        });
                        swalWithBootstrapButtons.fire(
                            `Eliminado el sugerencia ${sugerencia.label}!`,
                            'uno menos',
                            'success'
                        );
                    }
                    , err => {
                        console.log(err);
                        // swal.fire('Error al eliminar sugerencia', err.error.error, 'error');
                    }
                );
            }
        });

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
        console.log(this.filtroSugerencia);

        if (this.filterChecked) {
            this.nuevaPagina(0);
        } else {
            this.filtroSugerencia.init();
            this.nuevaPagina(0);
        }
    }

    public sortChangeColumn(colName: string): void {
        console.log(colName);
        if (colName === this.filtroSugerencia.order) {
            if (this.filtroSugerencia.direction === 'asc') {
                this.filtroSugerencia.direction = 'desc';
            }
            else {
                this.filtroSugerencia.direction = 'asc';
            }
        } else {
            this.filtroSugerencia.order = colName;
            this.filtroSugerencia.direction = 'asc';
        }
        this.nuevaPagina(0);
    }
    
    ngOnDestroy(): void {
        console.log('realizando unsubscribes');
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
