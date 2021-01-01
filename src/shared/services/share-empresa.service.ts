import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Empresa } from '../modelos/empresa';

@Injectable({
  providedIn: 'root'
})
export class ShareEmpresaService {

  private empresaMsg = new ReplaySubject<Empresa>();

  constructor() { }

  public getEmpresaMsg(): Observable<Empresa>{
    return this.empresaMsg as Observable<Empresa>;
  }

  public updateEmpresaMsg(empresa: Empresa): void {
    this.empresaMsg.next(empresa);
  }

}
