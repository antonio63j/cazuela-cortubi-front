import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import swal from 'sweetalert2';

import { Menu } from '../../../shared/modelos/menu';
import { ModalService } from '../../../shared/services/modal.service';
import { AdminMenuService } from '../admin-menu.service';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareEmpresaService } from 'src/app/shared/services/share-empresa.service';
import { Tipoplato } from 'src/app/shared/modelos/tipoplato';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss']
})

export class MenuFormComponent implements OnInit, OnDestroy {

  host: string = environment.urlEndPoint;
  public menu: Menu;
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject();
  public erroresValidacion: string[];

  public tipoControl = new FormControl('', Validators.required);

  constructor(
    private adminSugerenciaService: AdminMenuService,
    private shareEmpresaService: ShareEmpresaService,
    private modalService: ModalService,
    public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit(): void {
  }

  public update(menu: Menu): void {
    this.erroresValidacion = [];
    this.observ$ = this.adminSugerenciaService.update(menu).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          this.menu = json.data;

          // se está utilizando activeModal.close(true) en template
          // this.modalService.eventoCerrarModalScrollable.emit();
          swal.fire('menu actualizada', `${json.mensaje}, label: ${json.data.label}`, 'success');
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
  public create(menu: Menu): void {
    this.erroresValidacion = [];
    this.observ$ = this.adminSugerenciaService.create(menu).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          this.menu = json.data;
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
            swal.fire('Error al crear menu ', `error.status = ${err.status.toString()}`, 'error');
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