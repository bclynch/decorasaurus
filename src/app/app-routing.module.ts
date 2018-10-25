import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './modules/home/home.module#HomeModule' },
  { path: 'about', loadChildren: './modules/about/about.module#AboutModule' },
  { path: 'help', loadChildren: './modules/help/help.module#HelpModule' },
  { path: 'cart', loadChildren: './modules/cart/cart.module#CartModule' },
  { path: 'create', loadChildren: './modules/create/create.module#CreateModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
