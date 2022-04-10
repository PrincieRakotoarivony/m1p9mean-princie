import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantRoutingModule } from './restaurant-routing.module';
import { RestaurantComponent } from './restaurant.component';
import { ProduitsListRestaurantComponent } from '../produits-list-restaurant/produits-list-restaurant.component';
import { MyComponentsModule } from 'src/components/my-components/my-components.module';
import { ProduitAddComponent } from '../produit-add/produit-add.component';
import { ProduitFormComponent } from '../produit-form/produit-form.component';
import { FormsModule } from '@angular/forms';
import { ProduitUpdateComponent } from '../produit-update/produit-update.component';
import { CommandesRestoComponent } from '../commandes-resto/commandes-resto.component';
import { CommandeRestoComponent } from '../commande-resto/commande-resto.component';


@NgModule({
  declarations: [RestaurantComponent, ProduitsListRestaurantComponent, ProduitAddComponent, ProduitFormComponent, ProduitUpdateComponent, CommandesRestoComponent, CommandeRestoComponent],
  imports: [
    CommonModule,
    FormsModule,
    RestaurantRoutingModule,
    MyComponentsModule
  ],
  exports: [RestaurantComponent],
  bootstrap: [RestaurantComponent]
})
export class RestaurantModule { }
