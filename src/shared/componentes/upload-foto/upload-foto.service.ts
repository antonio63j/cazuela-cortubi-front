import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadFotoService {

  host = environment.urlEndPoint;
  constructor(
    private http: HttpClient
    ) {
  }

subirFoto(archivo: File, id: number, sufijoController: string): Observable<HttpEvent<{}>> {

  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('id', id.toString());

  const req = new HttpRequest('POST', `${environment.urlEndPoint}/${sufijoController}`, formData, {
    reportProgress: true
  });

  return this.http.request(req).pipe(
    catchError(err => {
      console.error(`error al subir foto: ${err.message} `);
      return throwError(err);
    }));
}
}
