import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import swal from 'sweetalert2';

import { Sugerencia } from '../../../shared/modelos/sugerencia';
import { ModalService } from '../../../shared/services/modal.service';
import { AdminSugerenciaService } from '../admin-sugerencia.service';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareEmpresaService } from 'src/app/shared/services/share-empresa.service';
import { Tipoplato } from 'src/app/shared/modelos/tipoplato';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sugerencia-form',
  templateUrl: './sugerencia-form.component.html',
  styleUrls: ['./sugerencia-form.component.scss']
})

export class SugerenciaFormComponent implements OnInit, OnDestroy {

  host: string = environment.urlEndPoint;
  public sugerencia: Sugerencia;
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject();
  public erroresValidacion: string[];
  public tipoPlatos: Tipoplato [];

  public tipoControl = new FormControl('', Validators.required);

  constructor(
    private adminSugerenciaService: AdminSugerenciaService,
    private shareEmpresaService: ShareEmpresaService,
    private modalService: ModalService,
    public activeModal: NgbActiveModal
  ) {
    this.tipoPlatos = this.shareEmpresaService.getIipoplatosInMem();
  }

  ngOnInit(): void {
  }

  public update(sugerencia: Sugerencia): void {
    this.erroresValidacion = [];
    this.observ$ = this.adminSugerenciaService.update(sugerencia).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          this.sugerencia = json.data;

          // se está utilizando activeModal.close(true) en template
          // this.modalService.eventoCerrarModalScrollable.emit();
          swal.fire('sugerencia actualizada', `${json.mensaje}, label: ${json.data.label}`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            // this.router.navigate(['/clientes']);
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error en actualización ', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }
  public create(sugerencia: Sugerencia): void {
    this.erroresValidacion = [];
    this.observ$ = this.adminSugerenciaService.create(sugerencia).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          this.sugerencia = json.data;
          // this.activeModal.close(true);
          // el cierre del modal se podría hacer con:

          // se está utilizando activeModal.close(true) desde el template
          // this.modalService.eventoCerrarModalScrollable.emit();

          // en lugar de activModal.close(true), se podría emitir evento
          // para cerrar modal con:
          // this.modalService.eventoCerrarModalScrollable.emit();
          // podriamos emitir este evento para cerrar modal con la
          // subscripcion que se hace con subscripcioneventoCerrarModalScrollable()
          // desde ClientesComponent

          swal.fire('creado tipo, no olvide asociar una foto', `${json.mensaje}, nombre: ${json.data.nombre}`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            // this.router.navigate(['/clientes']);
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error al crear sugerencia ', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  ngOnDestroy(): void{
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
