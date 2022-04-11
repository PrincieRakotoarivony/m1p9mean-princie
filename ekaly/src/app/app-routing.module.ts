import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from 'src/client/client/client.component';
import { ProduitsListClientComponent } from 'src/client/produits-list-client/produits-list-client.component';
import { ProduitsListComponent } from 'src/components/produits-list/produits-list.component';
import { EkalyComponent } from 'src/ekaly/ekaly/ekaly.component';
import { LivreurComponent } from 'src/livreur/livreur/livreur.component';
import { LoginComponent } from 'src/login/login.component';
import { MdpOublieComponent } from 'src/mdp-oublie/mdp-oublie.component';
import { RestaurantComponent } from 'src/restaurant/restaurant/restaurant.component';
import { AuthGuardClientService } from 'src/services/auth-guard-client.service';
import { AuthGuardEkalyService } from 'src/services/auth-guard-ekaly.service';
import { AuthGuardLivreurService } from 'src/services/auth-guard-livreur.service';
import { AuthGuardRestaurantService } from 'src/services/auth-guard-restaurant.service';
import { SignupComponent } from 'src/signup/signup.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../client/client/client.module').then(mod => mod.ClientModule),
    canActivate: [AuthGuardClientService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'mdp-oublie',
    component: MdpOublieComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'restaurant',
    loadChildren: () => import('../restaurant/restaurant/restaurant.module').then(mod => mod.RestaurantModule),
    canActivate: [AuthGuardRestaurantService]
  }, 
  {
    path: 'livreur',
    loadChildren: () => import('../livreur/livreur/livreur.module').then(mod => mod.LivreurModule),
    canActivate: [AuthGuardLivreurService]
  }, 
  {
    path: 'ekaly',
    loadChildren: () => import('../ekaly/ekaly/ekaly.module').then(mod => mod.EkalyModule),
    canActivate: [AuthGuardEkalyService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
