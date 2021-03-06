import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesStoreRoutingModule } from './pages-store-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UploadFotoComponent } from '../shared/componentes/upload-foto/upload-foto.component';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PaginatorComponent } from '../shared/componentes/paginator/paginator.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CartaComponent } from './carta/carta.component';
import { MenuComponent } from './menu/menu.component';
import { RecortarPipe } from '../shared/pipes/recortar.pipe';
import { SharedPipesModule } from '../shared';
import { MenuDetalleComponent } from './menu/menu-detalle/menu-detalle.component';
import { BrowserModule } from '@angular/platform-browser';
import { PaginatorModule } from '../shared/componentes/paginator/paginator.module';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [
    CartaComponent,
    MenuComponent,
    MenuDetalleComponent,

  ],

  imports: [
    CommonModule,

    PagesStoreRoutingModule,
    TranslateModule,

    FormsModule,

    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSortModule,

    MatSliderModule,
    MatSlideToggleModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    AngularEditorModule,

    PaginatorModule,

    MatRadioModule


  ],
  exports: [
    TranslateModule,

    FormsModule,

    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSortModule,

    MatSliderModule,
    MatSlideToggleModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    AngularEditorModule,
  ]
})
export class PagesStoreModule { }
