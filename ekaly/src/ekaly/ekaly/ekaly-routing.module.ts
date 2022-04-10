import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandeEkalyComponent } from '../commande-ekaly/commande-ekaly.component';
import { CommandeFicheEkalyComponent } from '../commande-fiche-ekaly/commande-fiche-ekaly.component';

const routes: Routes = [
  {path: '', redirectTo: '/ekaly/commandes', pathMatch: 'full'},
  {path: 'commandes', component: CommandeEkalyComponent},
  {path: 'commande/:idCmd', component: CommandeFicheEkalyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EkalyRoutingModule { }
