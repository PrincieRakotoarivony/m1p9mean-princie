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
  public static PROFILE_CLIENT: string = "1";
  public static PROFILE_RESTAURANT: string = "2";
  public static PROFILE_LIVREUR: string = "3";
  public static PROFILE_EKALY: string = "4";

  public static paths_map: any = {
    [AuthService.PROFILE_CLIENT]: "/",
    [AuthService.PROFILE_RESTAURANT]: "/restaurant",
    [AuthService.PROFILE_LIVREUR]: "/livreur",
    [AuthService.PROFILE_EKALY]: "/ekaly",
  };

  URL: string = `${BASE_URL}/auth`;
  
  constructor(private http: HttpClient, 
    private toolsService: ToolsService,
    private router: Router) { }

  canActivateRoute(id_profile_match: string){
    const token = localStorage.getItem(StorageService.TOKEN_KEY);
    const id_profile = localStorage.getItem(StorageService.ID_PROFILE_KEY);
    if(token && id_profile){
      if(id_profile == id_profile_match){
        return true;
      } else{
        this.router.navigateByUrl(AuthService.paths_map[id_profile]);
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


}
