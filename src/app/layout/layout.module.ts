
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header/header.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { FooterComponent } from './footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbModule

    ],
    declarations: [LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        FooterComponent
    ],

})
export class LayoutModule { }