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


@NgModule({
  declarations: [RestaurantComponent, ProduitsListRestaurantComponent, ProduitAddComponent, ProduitFormComponent, ProduitUpdateComponent],
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
