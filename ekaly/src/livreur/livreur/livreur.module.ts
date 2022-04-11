import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LivreurRoutingModule } from './livreur-routing.module';
import { CommandesLivreurComponent } from '../commandes-livreur/commandes-livreur.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgDragDropModule } from 'ng-drag-drop';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { DemoComponent } from '../demo/demo.component';



@NgModule({
  declarations: [
    CommandesLivreurComponent,
    DemoComponent
  ],
  imports: [
    CommonModule,
    LivreurRoutingModule,
    NgDragDropModule.forRoot(),
    DragAndDropModule
  ]
})
export class LivreurModule { }
