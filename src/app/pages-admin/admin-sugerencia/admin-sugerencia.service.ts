import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Sugerencia } from '../../shared/modelos/sugerencia';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
  providedIn: 'root'
})

export class AdminSugerenciaService implements OnDestroy {
  modal: any;
  constructor(
    private http: HttpClient,
    private ngbModal: NgbModal) {

  }

  getSugerencias(page: number): Observable<any> {
    const parametros = new HttpParams().set('page', page.toString()).set('size', '12');
    return this.http
      .get<Sugerencia[]>(environment.urlEndPoint + '/api/sugerencia/page', { params: parametros })
      .pipe(
        tap((response: any) => {
          // (response.content as Sugerencia[]).forEach(sugerencia => console.log(sugerencia));
        })
      );
  }

  getSugerenciasConFiltro(strBusca: string): Observable<any> {
    const parametros = new HttpParams().set('strBusca', strBusca);
    return this.http.get<Sugerencia[]>(environment.urlEndPoint + '/api/sugerencias-filtro', {
      params: parametros,
    });
  }

  create(sugerencia: Sugerencia): Observable<any> {
    /* se añade el token con TokenInterceptor
    return this.http.post<any>(this.urlEndPoint, cliente, { headers: this.httpHeader }); */

    return this.http.post<Sugerencia>(environment.urlEndPoint + '/api/sugerencia/create', sugerencia).pipe(
      catchError(err => {

        console.log(`error capturado: ${err.status} `);
        return throwError(err);
      })
    );
  }

  update(sugerencia: Sugerencia): Observable<any> {
    /* se añade el token con TokenInterceptor
    return this.http.post<any>(this.urlEndPoint, cliente, { headers: this.httpHeader }); */

    return this.http.put<Sugerencia>(environment.urlEndPoint + '/api/sugerencia/update', sugerencia).pipe(
      catchError(err => {
        console.log(`error capturado: ${err.status} `);
        return throwError(err);
      })
    );
  }

  delete(sugerencia: Sugerencia): Observable<any> {
    return this.http.delete<Sugerencia>(`${environment.urlEndPoint}/api/sugerencia/${sugerencia.id}`).pipe(
      catchError(err => {
        console.log(`error al eliminar sugerencia: ${err.status} `);
        console.log(`error al eliminar sugerencia: ${err.message} `);
        return throwError(err);
      }));
  }

  ngOnDestroy(): void {
    console.log(' en ngOnDestroy()');
  }

}
