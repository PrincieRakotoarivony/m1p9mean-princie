import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EkalyRoutingModule } from './ekaly-routing.module';
import { EkalyComponent } from './ekaly.component';
import { CommandeEkalyComponent } from '../commande-ekaly/commande-ekaly.component';
import { FormsModule } from '@angular/forms';
import { MyComponentsModule } from 'src/components/my-components/my-components.module';
import { CommandeFicheEkalyComponent } from '../commande-fiche-ekaly/commande-fiche-ekaly.component';


@NgModule({
  declarations: [EkalyComponent, CommandeEkalyComponent, CommandeFicheEkalyComponent],
  imports: [
    CommonModule,
    FormsModule,
    EkalyRoutingModule,
    MyComponentsModule
  ],
  exports: [EkalyComponent],
  bootstrap: [EkalyComponent]
})
export class EkalyModule { }
