import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Usuario } from '../../../../shared/modelos/usuario';
import swal from 'sweetalert2';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../../shared/services/modal.service';

import {Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface IUsuario {
  id: number;
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  email: string;
  roles: string[];
}

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})

export class LoginModalComponent implements OnInit, OnDestroy {
  //public usuario: Usuario = new Usuario();
  public titulo = 'Inicio de sesión';

  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>,
    @Inject(MAT_DIALOG_DATA) public usuario: IUsuario,
    public authService: AuthService,
    // public activeModal: NgbActiveModal,
    // private modalService: ModalService,
    private location: Location,

  ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.login(this.usuario).subscribe(
      response => {
        console.log(response);
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        const usuario = this.authService.usuario;
        console.log(`login con éxito de ${usuario.username}`);
        //this.modalService.eventoCerrarModalScrollable.emit();

      },
      err => {
        if (err.status === 400) {
        swal.fire('Error Login', 'las credenciales son incorrectas!', 'error');
        }
      }
      );
    return;
  }
  onNoClick(): void{
    this.dialogRef.close();

  }

  ngOnDestroy(): void{
    this.location.back();
  }
}
