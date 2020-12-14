import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbAlertModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { StatModule } from '../../shared';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
//import { ModalFormModule } from '../../shared/modules/modal-form/modal-form.module';

@NgModule({
    imports: [
        CommonModule, 
        NgbCarouselModule,
        NgbAlertModule,
        DashboardRoutingModule,
        StatModule
    ],
    declarations: [
        DashboardComponent
    ]
})
export class DashboardModule {}
