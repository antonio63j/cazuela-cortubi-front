import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

// import { ModalFormModule } from 'src/shared/modules/modal-form/modal-form.module';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    LoginRoutingModule,
    
    MatIconModule,  

    FormsModule,

    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,

    

    // ModalFormModule,
  ],

  declarations: [
    LoginComponent,
    LoginModalComponent
  ],

})
export class LoginModule { }
