import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/environments/environment';
import { StorageService } from '../storage.service';
import { ToolsService } from '../tools.service';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  URL: string = `${BASE_URL}/commandes`;
  constructor(private http: HttpClient, 
    private toolsService: ToolsService,
    private storageService: StorageService) { }

  commander(params: any){
    params.panier = this.storageService.getPanier();
    const url = `${this.URL}/save`
    return this.http.post(url, params, this.toolsService.getRequestOptions(true));
  }    
}
