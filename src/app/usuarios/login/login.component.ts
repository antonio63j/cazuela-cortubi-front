import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap, take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';

import { ModalConModeloService } from '../../../shared/services/modal-con-modelo.service';
import { ModalService } from '../../../shared/services/modal.service';
import { AuthService } from '../auth.service';
import { Usuario } from '../../../shared/modelos/usuario';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { Location } from '@angular/common';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
  allowOutsideClick: false
});

@Component({
 selector: 'app-login',
 templateUrl: './login.component.html',
 //styleUrls: ['./login.component.scss'],
  // animations: [routerTransition()]
})

export class LoginComponent implements OnInit, OnDestroy {
  usuario: Usuario = new Usuario();
  titulo = 'inicio de sesión';
  private unsubscribe$ = new Subject();

  constructor(
    private router: Router,
    private modalService: ModalService,
    private modalConModeloService: ModalConModeloService,
    public authService: AuthService,
    private location: Location) {
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      swal.fire('Aviso', `Ya estás autenticado! ${this.authService.usuario.username}`, 'info');
    } else {
      this.subscripcioneventoCerrarModalScrollable();
      this.crearModal();
    }
  }


  crearModal(): void {
    this.usuario.username = null;
    this.usuario.password = null;

    this.modalConModeloService.openModalScrollable(
      LoginModalComponent,
      { size: 'sm', backdrop: 'static', scrollable: true },
      this.usuario,
      'usuario',
      'Los campos con * son obligatorios',
      'Login'
    ).pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      console.log({ confirmedResult: result });
    });
  }

  subscripcioneventoCerrarModalScrollable(): void {
    this.modalService.eventoCerrarModalScrollable.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(
      () => {
        console.log('recibido evento para cerrar modal');
        this.modalConModeloService.closeModalScrollable();
       // this.location.back();
      }
    );
  }

  ngOnDestroy(): void {
    console.log('realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
