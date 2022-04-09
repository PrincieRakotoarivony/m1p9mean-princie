import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitsListComponent } from '../produits-list/produits-list.component';
import { ProduitCardComponent } from '../produit-card/produit-card.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    PaginationComponent,
    ProduitCardComponent,
    ProduitsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule
  ],
  exports: [
    ProduitsListComponent,
    PaginationComponent
  ]
})
export class MyComponentsModule { }
