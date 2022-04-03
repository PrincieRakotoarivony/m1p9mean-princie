import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from 'src/client/client/client.component';
import { EkalyComponent } from 'src/ekaly/ekaly/ekaly.component';
import { LivreurComponent } from 'src/livreur/livreur/livreur.component';
import { LoginComponent } from 'src/login/login.component';
import { RestaurantComponent } from 'src/restaurant/restaurant/restaurant.component';
import { AuthGuardClientService } from 'src/services/auth-guard-client.service';
import { AuthGuardEkalyService } from 'src/services/auth-guard-ekaly.service';
import { AuthGuardLivreurService } from 'src/services/auth-guard-livreur.service';
import { AuthGuardRestaurantService } from 'src/services/auth-guard-restaurant.service';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    canActivate: [AuthGuardClientService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'restaurant',
    component: RestaurantComponent,
    canActivate: [AuthGuardRestaurantService]
  }, 
  {
    path: 'livreur',
    component: LivreurComponent,
    canActivate: [AuthGuardLivreurService]
  }, 
  {
    path: 'ekaly',
    component: EkalyComponent,
    canActivate: [AuthGuardEkalyService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
