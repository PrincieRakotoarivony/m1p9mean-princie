import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/environments/environment';
import { StorageService } from '../storage.service';
import { ToolsService } from '../tools.service';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  URL: string = `${BASE_URL}/produits/panier`;
  constructor(private http: HttpClient, 
    private toolsService: ToolsService,
    private storageService: StorageService) { }

  getDetailsPanier(){
    const panier = this.storageService.getPanier();
    const url = `${this.URL}`
    return this.http.post(url, panier, this.toolsService.getRequestOptions());
  }   
}
