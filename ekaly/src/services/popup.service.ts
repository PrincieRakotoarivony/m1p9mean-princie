import { Injectable } from '@angular/core';
import { NgPopupsService } from 'ng-popups';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private ngPopups: NgPopupsService) { }

  showError(message: string){
    this.ngPopups.alert(message, {title: 'Erreur'});
  }

  beginLoading(){
    window.dispatchEvent(new CustomEvent('loading:begin'));
  }

  stopLoading(){
    window.dispatchEvent(new CustomEvent('loading:stop'));
  }
}
