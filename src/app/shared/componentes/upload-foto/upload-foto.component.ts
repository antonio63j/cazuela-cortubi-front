import { HttpEventType } from '@angular/common/http';
import { EventEmitter, Output } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';
import { UploadFotoService } from './upload-foto.service';

@Component({
  selector: 'app-upload-foto',
  templateUrl: './upload-foto.component.html',
  styleUrls: ['./upload-foto.component.scss']
})
export class UploadFotoComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() sufijoController: any;
  @Input() fotoActual: any;
  private observ$: Subscription = null;
  public host: string = environment.urlEndPoint;
  @Output() messageToEmit = new EventEmitter<string>();

  nombreArchivoFoto: File;
  progreso: number;
  private unsubscribe$ = new Subject();

  constructor(
    private uploadFotoService: UploadFotoService,
    private router: Router
    ) {
  }

  ngOnInit(): void {
  }

  selecionarFoto(event): void {
    this.nombreArchivoFoto = event.target.files[0];
    this.progreso = 0;

    if (this.nombreArchivoFoto.type.indexOf('image') < 0 ) {
       swal.fire('Error en selección de la foto', 'el archivo debe ser una imagen', 'error');
       this.nombreArchivoFoto = null;
    }
  }

  subirFoto(): void {
    console.log('sufijo =' + this.sufijoController);
    console.log('id =' + this.id);
    console.log('fotoActual =' + this.fotoActual);

    if (this.nombreArchivoFoto) {
      this.observ$ = this.uploadFotoService.subirFoto(this.nombreArchivoFoto, this.id, this.sufijoController)
        .pipe(
          takeUntil(this.unsubscribe$),
          tap((response: any) => {
            console.log(response);
          }),
        )
        .subscribe(
          event => {
            switch (event.type) {
              case HttpEventType.Sent:
                console.log (`Recibido evento HttpEventType.Sent.`);
                break;
              case HttpEventType.UploadProgress:
                this.progreso = Math.round(100 * event.loaded / event.total);
                break;
              case HttpEventType.Response:  // fichero subido complentamente
                const response: any = event.body;

                console.log('response=' + JSON.stringify(response));
                this.fotoActual = response.data.imgFileName;
                console.log('fotoActual=');
                console.log(this.fotoActual);
                // this.cliente = response.cliente as Cliente;
                // this.modalService.eventoNotificacionUpload.emit(this.cliente);
                swal.fire('La foto se ha subido con éxito', response.mensaje, 'success');
                break;
              default:
                console.log (`surprising upload event: ${event.type}.`);
                break;
            }

          },
          err => {
            //  swal solo mustra el último aviso, por tanto no vemos el swal que se ha puesto en AuthInterceptor
            swal.fire(`status  ${err.status}`, err.error.error, 'error');
            console.error(err);
          }
        );
    } else {
      swal.fire('Error', 'debe seleccionar una foto', 'error');
      }
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
