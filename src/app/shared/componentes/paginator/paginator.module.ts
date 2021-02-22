import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';


import { PaginatorComponent } from './paginator.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatSelectModule
    ],
    declarations: [PaginatorComponent],
    exports: [PaginatorComponent]
})
export class PaginatorModule {

}
