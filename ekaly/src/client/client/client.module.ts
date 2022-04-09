import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { ProduitsListClientComponent } from '../produits-list-client/produits-list-client.component';
import { ProduitsListComponent } from 'src/components/produits-list/produits-list.component';
import { MyComponentsModule } from 'src/components/my-components/my-components.module';
import { PanierComponent } from '../panier/panier.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ClientComponent,
    ProduitsListClientComponent,
    PanierComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MyComponentsModule,
    ClientRoutingModule
  ],
  exports: [ClientComponent],
  bootstrap: [ClientComponent]
})
export class ClientModule { }
