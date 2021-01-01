import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';

import swal from 'sweetalert2';

import { environment } from 'src/environments/environment';
import { EmpresaService } from './empresa.service';
import { Empresa } from 'src/shared/modelos/empresa';
import { Subject, Subscription } from 'rxjs';
import { ShareEmpresaService } from 'src/shared/services/share-empresa.service';


@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit, OnDestroy {
  help = false;
  host: string = environment.urlEndPoint;
  public erroresValidacion: string[];
  empresa: Empresa;
  private observ$: Subscription = null;
  private observ1$: Subscription = null;
  private observ2$: Subscription = null;
  private unsubscribe$ = new Subject();
  
  constructor(
    private location: Location,
    private empresaService: EmpresaService,
    private shareEmpresaService: ShareEmpresaService

  ) {
      this.getEmpresa(1);
  }

  ngOnInit(): void {
  }

  getEmpresa(id: number): void {
    this.observ$ = this.empresaService.get(id).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          this.empresa = json;
          // swal.fire('Consulta Ok', 'empresa', 'success');
        }
        , err => {
          if (err.status === 400) {
            console.log('error 400');
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            console.log('nook');
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error en consulta empresa', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  update(empresa: Empresa): void {
    if (empresa.id) {
      this.updateEmpresa(empresa);
    } else {
      this.createEmpresa(empresa);
    }
  }

  updateEmpresa(empresa: Empresa): void{
    this.erroresValidacion = [];
    this.observ1$ = this.empresaService.update(empresa).pipe(
      takeUntil(this.unsubscribe$)
      /*      , catchError(err => {
               console.log('Se muestra el error y se vuelve a lanzar con throwError(err)', err);
               return throwError(err);
            }) */
    )
      .subscribe(
        json => {
          this.empresa = json.empresa;
          this.shareEmpresaService.updateEmpresaMsg(this.empresa);
          swal.fire('Actualización ', `${json.mensaje} - (id=${json.empresa.id})`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            // this.router.navigate(['/cursos']);
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error en actualización empresa', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  createEmpresa(empresa: Empresa): void{
    this.observ2$ = this.empresaService.create(empresa).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          swal.fire('Creada empresa', `${json.mensaje} - ${json.empresa.nombre}`, 'success');
        }
        , err => {
          if (err.status === 400) {
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            // this.router.navigate(['/cursos']);
            console.log(`error=${JSON.stringify(err)}`);
            swal.fire('Error en alta de empresa', `error.status = ${err.status.toString()}`, 'error');
          }
        }
      );
  }

  cancelar(): void {
    this.location.back();
  }

  ayuda(): void {
    this.help = !this.help;
  }

  ngOnDestroy(): void{
    console.log('EmpresaComponent.ngOnDestroy (), realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.observ$ != null && !this.observ$.closed) {
      console.log('haciendo : this.observ$.unsubscribe()');
      this.observ$.unsubscribe();
    } else {
      console.log('No necesario hacer: this.observ$.unsubscribe()');
    }

    if (this.observ1$ != null && !this.observ1$.closed) {
      console.log('haciendo : this.observ1$.unsubscribe()');
      this.observ$.unsubscribe();
    } else {
      console.log('No necesario hacer: this.observ1$.unsubscribe()');
    }

    if (this.observ2$ != null && !this.observ2$.closed) {
      console.log('haciendo : this.observ2$.unsubscribe()');
      this.observ$.unsubscribe();
    } else {
      console.log('No necesario hacer: this.observ2$.unsubscribe()');
    }

  } 

}
