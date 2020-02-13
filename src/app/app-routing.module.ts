import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
  { path: 'about', loadChildren: () => import('./modules/about/about.module').then(m => m.AboutModule) },
  { path: 'help', loadChildren: () => import('./modules/help/help.module').then(m => m.HelpModule) },
  { path: 'cart', loadChildren: () => import('./modules/cart/cart.module').then(m => m.CartModule) },
  { path: 'checkout', loadChildren: () => import('./modules/checkout/checkout.module').then(m => m.CheckoutModule) },
  { path: 'create', loadChildren: () => import('./modules/create/create.module').then(m => m.CreateModule) },
  { path: 'account', loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule) },
  { path: 'policies', loadChildren: () => import('./modules/policies/policies.module').then(m => m.PoliciesModule) },
  { path: '**', loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
