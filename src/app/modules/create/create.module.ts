import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CreateComponent
  },
  // { path: 'poster-generator',
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: '../generator/generator.module#GeneratorModule'
  //     },
  //     {
  //       path: ':type',
  //       loadChildren: '../generator/generator.module#GeneratorModule'
  //     }
  //   ]
  // }
  {
    path: 'poster-generator',
    loadChildren: () => import('../generator/generator.module').then(m => m.GeneratorModule)
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [CreateComponent]
})
export class CreateModule { }
