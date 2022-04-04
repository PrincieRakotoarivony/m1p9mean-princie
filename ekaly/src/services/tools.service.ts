import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor() { }

  getRequestOptions(authorization = false){
    var headers = new HttpHeaders()
    .set('Content-type', 'application/json');
    if(authorization)
      headers = headers.set('authorization', 'Bearer '+localStorage.getItem(StorageService.TOKEN_KEY));

    const options = {
      headers 
    }
    console.log(options);
    return options;
  }
}
