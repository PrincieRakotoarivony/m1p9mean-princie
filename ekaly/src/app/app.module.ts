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

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent
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
    RestaurantModule 
  ],
  providers: [{provide: LOCALE_ID, useValue: 'fr-FR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
