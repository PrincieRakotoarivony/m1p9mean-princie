import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/environments/environment';
import { StorageService } from '../storage.service';
import { ToolsService } from '../tools.service';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  public static commandeEtats: any = ["Nouvelle", "En cours de préparation", "Prête à être livrée", "Assignée à un livreur", "En cours de livraison", "Livrée"];

  URL: string = `${BASE_URL}/commandes`;
  constructor(private http: HttpClient, 
    private toolsService: ToolsService,
    private storageService: StorageService) { }

  commander(params: any){
    params.panier = this.storageService.getPanier();
    const url = `${this.URL}/save`
    return this.http.post(url, params, this.toolsService.getRequestOptions(true));
  }    

  findCommandesClient(params: any){
    const url = `${this.URL}/client`
    return this.http.post(url, params, this.toolsService.getRequestOptions(true));
  }  
  
  
  findCommande(id: string){
    const url = `${this.URL}/${id}`
    return this.http.get(url, this.toolsService.getRequestOptions());
  }  

  findCommandesResto(params: any){
    const url = `${this.URL}/resto`
    return this.http.post(url, params, this.toolsService.getRequestOptions(true));
  } 
  
  findCommandeRestoById(id: string){
    const url = `${this.URL}/resto/${id}`
    return this.http.get(url, this.toolsService.getRequestOptions(true));
  } 

  findCommandesEkaly(params: any){
    const url = `${this.URL}/ekaly`
    return this.http.post(url, params, this.toolsService.getRequestOptions(true));
  }

  findCmdEkalyById(id: string){
    const url = `${this.URL}/ekaly/${id}`
    return this.http.get(url, this.toolsService.getRequestOptions(true));
  } 

  changerEtatCmdResto(idCmd: string, etat: number){
    const url = `${this.URL}/resto/${idCmd}/etat?etat=${etat}`
    return this.http.post(url, {}, this.toolsService.getRequestOptions(true));
  }

  assigner(idCmd: string, idLivreur: string){
    const url = `${this.URL}/${idCmd}/assigner?idLivreur=${idLivreur}`
    return this.http.get(url, this.toolsService.getRequestOptions(true));
  }

  findCommandesLivreur(params: any){
    const url = `${this.URL}/livreur/etat`;
    return this.http.post(url, params, this.toolsService.getRequestOptions(true));
  }

  setEtatLivraison(idCmd: string, etat: number){
    const url = `${this.URL}/${idCmd}/etat-livraison?etat=${etat}`;
    return this.http.post(url, {}, this.toolsService.getRequestOptions(true));
  }
}
