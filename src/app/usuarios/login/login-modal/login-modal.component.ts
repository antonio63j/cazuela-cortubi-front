import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Usuario } from '../../../shared/modelos/usuario';
import swal from 'sweetalert2';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../shared/services/modal.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})

export class LoginModalComponent implements OnInit, OnDestroy {
  public usuario: Usuario = new Usuario();
  public titulo = 'Inicio de sesión';
  public hide = true;

  constructor(
    public authService: AuthService,
    public activeModal: NgbActiveModal,
    private modalService: ModalService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('en ngOninit');
  }

  login(): void {
    this.authService.login(this.usuario).subscribe(
      response => {
        console.log(response);
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        const usuario = this.authService.usuario;
        console.log(`login con éxito de ${usuario.username}`);
        this.modalService.eventoCerrarModalScrollable.emit();
      },
      err => {
        console.log(err);
        if (err.status === 400) {
          swal.fire('Error Login', 'Usuario o password incorrectas o cuenta no activada!', 'error');
        } else {
          swal.fire('Error Login', err.status, 'error');
        }
      }
    );
    return;
  }

  resetPassword(): void {
    // this.modalService.eventoCerrarModalScrollable.emit();
    this.activeModal.close('resetPassword');
  }

  ngOnDestroy(): void {
    console.log('en ngOnDestroy()');
    if (this.authService.hasRole('ROLE_ADMIN')) {
      console.log('se redirige a admin-index');
      this.router.navigate(['\admin-index']);
    } else {
      this.location.back();
    }
  }
}
