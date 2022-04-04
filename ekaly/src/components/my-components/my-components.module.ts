import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitsListComponent } from '../produits-list/produits-list.component';



@NgModule({
  declarations: [
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
