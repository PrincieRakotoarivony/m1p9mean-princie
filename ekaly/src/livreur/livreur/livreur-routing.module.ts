import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandesLivreurComponent } from '../commandes-livreur/commandes-livreur.component';
import { DemoComponent } from '../demo/demo.component';

const routes: Routes = [
  {path: '', redirectTo: '/livreur/commandes', pathMatch: 'full'},
  {path:'commandes', component: CommandesLivreurComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LivreurRoutingModule { }
