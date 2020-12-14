import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', loadChildren: () => import('./layout/layout.module').then((m) => m.LayoutModule) },
   // { path: 'login', loadChildren: () => import('./usuarios/login/login.module').then((m) => m.LoginModule) },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false }) ,

             ],
    exports: [RouterModule
             ]
})
export class AppRoutingModule {}
