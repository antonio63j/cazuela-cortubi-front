import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/shared/services/modal.service';
import { AuthService } from '../../auth.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Usuario } from 'src/shared/modelos/usuario';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import swal from 'sweetalert2';


@Component({
  selector: 'app-pwd-reset-modal',
  templateUrl: './pwd-reset-modal.component.html',
  styleUrls: ['./pwd-reset-modal.component.scss']
})
export class PwdResetModalComponent implements OnInit, OnDestroy {
  public codigoEnviado = false;
  public usuario: Usuario = new Usuario();
  public hide = true;
  public password2 = '';
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject();

  constructor(
    public authService: AuthService,
    public activeModal: NgbActiveModal,
    private modalService: ModalService,
    private translate: TranslateService,
    private location: Location
  ) { }

  ngOnInit(): void {
  }

  enviarEmail(): void {
    this.observ$ = this.authService.resetPwd(this.usuario).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    ).subscribe(
      response => {
        this.codigoEnviado = true;
        // this.modalService.eventoCerrarModalScrollable.emit();
        swal.fire('Reset contraseña de usuario: ', 'Se envió un email con un codigo que le permitirá cambiar la contraseña, no olvide revisar la bandeja de spam', 'success');
      },
      err => {
        console.log(err);
        swal.fire('Error en la gestión del cambio de contraseña', `status ${err.status}, ${err.error.mensaje} `, 'error');
      }
    );
    return;
  }

  actualizarPwd(): void {
    this.observ$ = this.authService.actualizarPwd(this.usuario).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(
      response => {
        // this.modalService.eventoCerrarModalScrollable.emit();
        this.activeModal.close(true);
      },
      err => {
        console.log(err);
        swal.fire('Error en la gestión del cambio de contraseña', `status ${err.status}, ${err.error.mensaje} `, 'error');
      }
    );
    return;
  }
  ngOnDestroy(): void {
    console.log('realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
