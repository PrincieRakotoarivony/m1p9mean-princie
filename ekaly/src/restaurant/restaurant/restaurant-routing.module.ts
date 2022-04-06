import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProduitAddComponent } from '../produit-add/produit-add.component';
import { ProduitUpdateComponent } from '../produit-update/produit-update.component';
import { ProduitsListRestaurantComponent } from '../produits-list-restaurant/produits-list-restaurant.component';

const routes: Routes = [
  {path: '', component: ProduitsListRestaurantComponent},
  {path: 'produit-add', component: ProduitAddComponent},
  {path: '/produit-update/:id_produit', component: ProduitUpdateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
