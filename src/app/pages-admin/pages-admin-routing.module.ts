import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminIndexComponent } from './admin-index/admin-index.component';
import { EmpresaComponent } from './empresa/empresa.component';

const routes: Routes = [
  {
    path: '', component: AdminIndexComponent,
  }
  ,
  {
    path: 'empresa', component: EmpresaComponent,
  }
]

  // {
  //   path: '', component: AdminIndexComponent,
  //   children: [
  //       {
  //         path: '/empresa', component: EmpresaComponent
  //       }
  //       // ,
  //       // {
  //       //   path: 'registro', loadChildren: () => import('../usuarios/signup/signup.module').then((m) => m.SignupModule)
  //       // }
  //   ]
  // }


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesAdminRoutingModule { }
