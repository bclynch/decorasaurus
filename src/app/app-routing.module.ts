import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './modules/home/home.module#HomeModule' },
  { path: 'about', loadChildren: './modules/about/about.module#AboutModule' },
  { path: 'help', loadChildren: './modules/help/help.module#HelpModule' },
  { path: 'cart', loadChildren: './modules/cart/cart.module#CartModule' },
  { path: 'checkout', loadChildren: './modules/checkout/checkout.module#CheckoutModule' },
  { path: 'create', loadChildren: './modules/create/create.module#CreateModule' },
  { path: 'account', loadChildren: './modules/account/account.module#AccountModule' },
  { path: 'policies', loadChildren: './modules/policies/policies.module#PoliciesModule' },
  { path: '**', loadChildren: './modules/not-found/not-found.module#NotFoundModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
