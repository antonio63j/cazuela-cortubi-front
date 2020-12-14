import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageTranslationModule } from '../shared/modules/language-translation/language-translation.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalFormModule } from '../shared/modules/modal-form/modal-form.module';
import { ModalService } from '../shared/services/modal.service';
import { ModalConModeloService } from '../shared/services/modal-con-modelo.service';
import { AuthService } from './usuarios/auth.service';
import { AllMaterialModule } from 'src/shared/modules/all-material-module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule,
    LanguageTranslationModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,

    ModalFormModule,
    AllMaterialModule
  ],
  
  providers: [
        ModalService,
        ModalConModeloService,
        AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
