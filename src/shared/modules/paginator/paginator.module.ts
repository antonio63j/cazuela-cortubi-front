import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { PaginatorComponent } from './paginator.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
    ],
    declarations: [PaginatorComponent],
    exports: [PaginatorComponent]
})
export class PaginatorModule {

}
