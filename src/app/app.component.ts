import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Empresa } from 'src/shared/modelos/empresa';
import { ShareEmpresaService } from 'src/shared/services/share-empresa.service';
import { EmpresaService } from './pages-admin/empresa/empresa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Restaurante demo';
  private observ$: Subscription = null;
  private unsubscribe$ = new Subject();
  empresa: Empresa;

  constructor(
    private empresaService: EmpresaService,
    private shareEmpresaService: ShareEmpresaService) {
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
          document.title = this.empresa.nombre;
          this.shareEmpresaService.updateEmpresaMsg(this.empresa);
          // console.log(`json=${JSON.stringify(json)}`);
          console.log('enviado cambio datos empresa');
        }
        , err => {
          if (err.status === 400) {
            console.log('error 400');
          } else {
            console.log('nook');
            console.log(`error=${JSON.stringify(err)}`);
          }
        }
      );
  }

  ngOnDestroy(): void {
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
