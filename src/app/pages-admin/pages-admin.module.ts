import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesAdminRoutingModule } from './pages-admin-routing.module';
import { AdminIndexComponent } from './admin-index/admin-index.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmpresaComponent } from './empresa/empresa.component';


@NgModule({
  declarations: [
    AdminIndexComponent,
    EmpresaComponent
  ],
  imports: [
    CommonModule,
    PagesAdminRoutingModule,
    TranslateModule,

    FormsModule,

    MatIconModule,

    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  exports: [
  ]
})
export class PagesAdminModule { }
