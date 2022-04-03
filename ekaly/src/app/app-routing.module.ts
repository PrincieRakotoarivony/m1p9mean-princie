import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from 'src/client/client/client.component';
import { LivreurComponent } from 'src/livreur/livreur/livreur.component';
import { LoginComponent } from 'src/login/login.component';
import { RestaurantComponent } from 'src/restaurant/restaurant/restaurant.component';
import { AuthGuardService } from 'src/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/client',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'restaurant',
    component: RestaurantComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'client',
    component: ClientComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'livreur',
    component: LivreurComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
