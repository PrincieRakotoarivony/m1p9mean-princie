import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BASE_URL } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { ToolsService } from './tools.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public static PROFILE : any = {
    CLIENT: "62502e5577bc1a7c7c12c108",
    RESTAURANT :  "62502e7177bc1a7c7c12c109",
    LIVREUR: "62502e8277bc1a7c7c12c10a",
    EKALY: "62502e9077bc1a7c7c12c10b"
  };
  

  public static paths_map: any = {
    [AuthService.PROFILE.CLIENT]: "/",
    [AuthService.PROFILE.RESTAURANT]: "/restaurant",
    [AuthService.PROFILE.LIVREUR]: "/livreur",
    [AuthService.PROFILE.EKALY]: "/ekaly",
  };

  URL: string = `${BASE_URL}/auth`;
  
  constructor(private http: HttpClient, 
    private toolsService: ToolsService,
    private router: Router,
    private storageService: StorageService) { }

  canActivateRoute(id_profile_match: string){
    const token = localStorage.getItem(StorageService.TOKEN_KEY);
    const user = this.storageService.getUser();
    if(token){
      if(user.profile == id_profile_match){
        return true;
      } else{
        this.router.navigateByUrl(AuthService.paths_map[user.profile]);
      }
    } else{
      this.router.navigateByUrl("/login");
    }
    return false;
  }

  login(utilisateur: any){
    const url = `${this.URL}/login`;
    return this.http.post(url, utilisateur, this.toolsService.getRequestOptions());
  }

  logout(){
    const url = `${this.URL}/logout`;
    return this.http.delete(url, this.toolsService.getRequestOptions(true));
  }

  signup(utilisateur: any){
    const url = `${this.URL}/signup`;
    return this.http.post(url, utilisateur, this.toolsService.getRequestOptions());
  }

  getLivreurs(search: string){
    const url = `${BASE_URL}/livreurs?search=${search}`;
    return this.http.get(url, this.toolsService.getRequestOptions());
  }

}
