import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Menu } from 'src/app/shared/modelos/menu';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminMenuService implements OnDestroy {

  constructor(private http: HttpClient) {

  }

  getMenus(): Observable<any> {
    return this.http.get<Menu[]>(environment.urlEndPoint + '/api/menu/list').pipe(
      tap((response: any) => {
        //  (response.content as menu[]).forEach (menu => console.log(menu));
      }),
      map((response: any) => {
        (response as Menu[]).map(menu => {
          return menu;
        });
        return response;
      })
    );
  }

  create(menu: Menu): Observable<any> {
    /* se añade el token con TokenInterceptor
    return this.http.post<any>(this.urlEndPoint, menu, { headers: this.httpHeader }); */
    menu.id = null;
    return this.http.post<Menu>(environment.urlEndPoint + '/api/menu/create', menu).pipe(
      catchError(err => {
        console.log(`error capturado en create: ${err.error.error} `);
        return throwError(err);
      })
    );
  }

  update(menu: Menu): Observable<any> {
    return this.http.put(environment.urlEndPoint + '/api/menu/update', menu).pipe(
      catchError(err => {
        console.log(`error al actualizar datos del menu: ${err.message} `);
        return throwError(err);
      })
      // , map((response: any) => response.menu as menu)
    );
  }

  delete(id: number): Observable<Menu> {
    return this.http.delete<Menu>(`${environment.urlEndPoint}/api/menu/${id}`).pipe(
      catchError(err => {
        console.error(`error al eliminar menu: ${err.status} `);
        console.error(`error al eliminar menu: ${err.message} `);
        return throwError(err);
      }));
  }

  ngOnDestroy(): void {
    console.log('En ngOnDestroy ()');
  }
}

