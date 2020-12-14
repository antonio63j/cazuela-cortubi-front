import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ModalFormModule } from 'src/shared/modules/modal-form/modal-form.module';
import { LoginModalComponent } from './login-modal/login-modal.component';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
    imports: [CommonModule,
              TranslateModule,
              LoginRoutingModule,
              ModalFormModule,
              FormsModule,
              // MatDialogModule,
              MatButtonModule,
              MatCommonModule,
              MatFormFieldModule,
              MatIconModule,
              MatListModule,
              MatInputModule,


              // NgbActiveModal
            ],

    declarations: [
      LoginComponent,
      LoginModalComponent
    ],

})
export class LoginModule {}
