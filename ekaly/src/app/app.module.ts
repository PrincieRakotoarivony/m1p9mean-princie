import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgPopupsModule } from 'ng-popups';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from 'src/login/login.component';
import { ProduitsListComponent } from 'src/components/produits-list/produits-list.component';
import { ProduitsListClientComponent } from 'src/client/produits-list-client/produits-list-client.component';
import { ClientModule } from '../client/client/client.module';
import { MyComponentsModule } from '../components/my-components/my-components.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
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
    ClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
