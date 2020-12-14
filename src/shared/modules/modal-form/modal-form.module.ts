import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule} from '@angular/material/button';


import { MatExpansionModule } from '@angular/material/expansion';
//import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from 'src/app/usuarios/login/login.component';
import { LoginModalComponent } from 'src/app/usuarios/login/login-modal/login-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,

        //AngularEditorModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCardModule
        
        // MatExpansionModule
    ],

    declarations: [
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSortModule,
        MatCardModule

    ],
    providers: [

    ],
})
export class ModalFormModule { }
