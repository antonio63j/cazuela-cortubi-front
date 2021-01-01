import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Empresa } from 'src/shared/modelos/empresa';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    private http: HttpClient
  ) { }

  get(id: number): Observable<any> {
    const parametros = new HttpParams()
     .set('id', id.toString());
    return this.http.get<Empresa>(environment.urlEndPoint + '/api/empresa', { params: parametros })
      .pipe(
        tap((response: any) => {

        })
      );
  }

  create(empresa: Empresa): Observable<any> {
    return this.http.post<Empresa>(environment.urlEndPoint + '/api/empresa', empresa)
      .pipe(
        catchError(err => {
          console.log('error capturado ' + JSON.stringify(err));
          return throwError(err);
        })
      );
  }

  update(empresa: Empresa): Observable<any> {
    return this.http.put<Empresa>(environment.urlEndPoint + '/api/empresa', empresa)
      .pipe(
        catchError(err => {
          console.log('error capturado ' + JSON.stringify(err));
          return throwError(err);
        })
      )
  }


}
