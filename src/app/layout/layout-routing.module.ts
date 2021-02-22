import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminIndexComponent } from '../pages-admin/admin-index/admin-index.component';
import { RoleGuard } from '../usuarios/guards/role.guard';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
      path: '', component: LayoutComponent,
      children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
          { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule)},
          { path: 'admin-index',  canActivate: [RoleGuard], data: {role: 'ROLE_ADMIN'},
            loadChildren: () => import('../pages-admin/pages-admin.module').then((m) => m.PagesAdminModule) },
          // { path: 'admin-sugerencia',  canActivate: [RoleGuard], data: {role: 'ROLE_ADMIN'},
          //   loadChildren: () => import('../pages-admin/pages-admin.module').then((m) => m.PagesAdminModule) },

          { path: 'admin-menu',  canActivate: [RoleGuard], data: {role: 'ROLE_ADMIN'},
            loadChildren: () => import('../pages-admin/pages-admin.module').then((m) => m.PagesAdminModule) },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
