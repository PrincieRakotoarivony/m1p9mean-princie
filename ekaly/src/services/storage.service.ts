import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public static TOKEN_KEY: string = "token";
  public static ID_PROFILE_KEY: string = "id_profile";
  public static ID_UTILISATEUR_KEY: string = "id_utilisateur";

  constructor() { }
  
  isLoggedIn(){
    const token = localStorage.getItem(StorageService.TOKEN_KEY);
    return token !== null && token !== undefined;
  }
}
