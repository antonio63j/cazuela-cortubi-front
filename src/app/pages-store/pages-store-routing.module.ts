import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartaComponent } from './carta/carta.component';
import { MenuComponent } from './menu/menu.component';


const routes: Routes = [

  {
    path: 'carta', component: CartaComponent,
  }
  ,
  {
    path: 'menu', component: MenuComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesStoreRoutingModule { }
