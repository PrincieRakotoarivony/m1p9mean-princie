import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProduitsListClientComponent } from '../produits-list-client/produits-list-client.component';

const routes: Routes = [
  {path: '', component: ProduitsListClientComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
