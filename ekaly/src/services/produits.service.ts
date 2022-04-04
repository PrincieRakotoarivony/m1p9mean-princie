import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/environments/environment';
import { ToolsService } from './tools.service';

@Injectable({
  providedIn: 'root'
})
export class ProduitsService {

  URL: string = `${BASE_URL}/produits`;
  
  constructor(private http: HttpClient, 
    private toolsService: ToolsService) { }

  findProduits(params: any){
    const url = `${this.URL}`
    return this.http.post(url, params, this.toolsService.getRequestOptions());
  }  
}
