import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitsListComponent } from '../produits-list/produits-list.component';
import { ProduitCardComponent } from '../produit-card/produit-card.component';



@NgModule({
  declarations: [
    ProduitCardComponent,
    ProduitsListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProduitsListComponent
  ]
})
export class MyComponentsModule { }
