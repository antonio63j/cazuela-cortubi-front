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
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { UploadFotoComponent } from '../shared/componentes/upload-foto/upload-foto.component';
import { AdminSlidersComponent } from './admin-sliders/admin-sliders.component';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { SliderFormComponent } from './admin-sliders/slider-form/slider-form.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AdminTipoplatoComponent } from './admin-tipoplato/admin-tipoplato.component';
import { TipoplatoFormComponent } from './admin-tipoplato/tipoplato-form/tipoplato-form.component';

@NgModule({
  declarations: [
    AdminIndexComponent,
    EmpresaComponent,
    AdminHomeComponent,
    AdminSlidersComponent,
    SliderFormComponent,
    AdminTipoplatoComponent,
    TipoplatoFormComponent,
    UploadFotoComponent
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

    MatSortModule,
    MatCardModule,
    AngularEditorModule

  ],
  exports: [

  ]
})
export class PagesAdminModule { }
