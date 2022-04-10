import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandeComponent } from '../commande/commande.component';
import { CommandesComponent } from '../commandes/commandes.component';
import { PanierComponent } from '../panier/panier.component';
import { ProduitsListClientComponent } from '../produits-list-client/produits-list-client.component';

const routes: Routes = [
  {path: '', component: ProduitsListClientComponent},
  {path: 'panier', component: PanierComponent},
  {path: 'commandes', component: CommandesComponent},
  {path: 'commande/:idCmd', component: CommandeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
