import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../usuarios/login/login.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent,
        children: [
            {
              path: 'login', loadChildren: () => import('../usuarios/login/login.module').then((m) => m.LoginModule) ,
              // path: 'login', component: LoginComponent, // child route component that the router renders
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
