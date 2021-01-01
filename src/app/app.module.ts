import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageTranslationModule } from '../shared/modules/language-translation/language-translation.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalService } from '../shared/services/modal.service';
import { ModalConModeloService } from '../shared/services/modal-con-modelo.service';
import { AuthService } from './usuarios/auth.service';
import { AllMaterialModule } from 'src/shared/modules/all-material-module';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { LoggingInterceptor } from './usuarios/interceptors/logging.interceptor';

export const MY_FORMATS = {
  parse: {
      dateInput: 'DD/MM/YYYY',
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MM YYYY',
      dateA11yLabel: 'DD/MM/YYYY',
      monthYearA11yLabel: 'MM YYYY',
  },
};

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
    BrowserAnimationsModule,
    NgbModule,

    // AllMaterialModule


    // NgbModule,
    // ModalFormModule,
    // FormsModule,
  ],

  exports: [
  ],

  providers: [
        ModalService,
        ModalConModeloService,
        AuthService,
        {provide: MAT_DATE_LOCALE, useValue: 'es'},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
