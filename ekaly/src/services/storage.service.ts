import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public static TOKEN_KEY: string = "token";
  public static USER_KEY: string = "user";

  constructor() { }
  
  isLoggedIn(){
    const token = localStorage.getItem(StorageService.TOKEN_KEY);
    return token !== null && token !== undefined;
  }

  getUser(){
    const user = localStorage.getItem(StorageService.USER_KEY);
    return user ? JSON.parse(user) : {};
  }
}
