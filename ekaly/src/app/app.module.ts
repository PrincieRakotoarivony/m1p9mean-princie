import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgPopupsModule } from 'ng-popups';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from 'src/login/login.component';
import { ClientModule } from '../client/client/client.module';
import { RestaurantModule } from '../restaurant/restaurant/restaurant.module';
import { SignupComponent } from 'src/signup/signup.component';
import { EkalyModule } from '../ekaly/ekaly/ekaly.module';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { MdpOublieComponent } from 'src/mdp-oublie/mdp-oublie.component';
import { LivreurModule } from '../livreur/livreur/livreur.module';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    MdpOublieComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    NgPopupsModule.forRoot({
      theme: 'default', 
      okButtonText: 'OK',
      cancelButtonText: 'Annuler',
      color: '#6c757d',
      titles: {
        alert: 'Danger!',
        confirm: 'Confirmation',
        prompt: 'Le site demande...'
      }
    }),
    BrowserModule,
    AppRoutingModule,
    ClientModule,
    RestaurantModule,
    EkalyModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.65)', 
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff', 
      secondaryColour: '#ffffff', 
      tertiaryColour: '#ffffff'
    }),
    LivreurModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'fr-FR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
