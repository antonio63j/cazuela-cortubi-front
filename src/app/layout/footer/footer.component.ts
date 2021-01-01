import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShareEmpresaService } from 'src/shared/services/share-empresa.service';
import { Empresa } from 'src/shared/modelos/empresa';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  public empresa: Empresa = new Empresa();
  public subscription: Subscription;

  constructor(
    public shareEmpresaService: ShareEmpresaService) {

  }

  ngOnInit(): void {
    this.subscription = this.shareEmpresaService.getEmpresaMsg()
    .subscribe(msg => {
        this.empresa = msg;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // onDestroy cancels the subscribe request
  }

}
