import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { PopupService } from 'src/services/popup.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  utilisateur: any = {
    nomUtilisateur: 'princie7',
    mdp: '123456'
  }
  constructor(private authService: AuthService,
    private popupSertice: PopupService,
    private router: Router){}
  ngOnInit(): void {
    
  }

  login(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        const data = res.data;
        localStorage.setItem(StorageService.TOKEN_KEY, data.token);
        localStorage.setItem(StorageService.ID_PROFILE_KEY, data.id_profile);
        localStorage.setItem(StorageService.ID_UTILISATEUR_KEY, data.id_utilisateur);
        window.dispatchEvent(new CustomEvent('user:login'));
        this.router.navigateByUrl("/");
      } else{
        this.popupSertice.showError(res.meta.message);
      }
    };

    const error = (err: any) => {
      this.popupSertice.showError(err.message);
    };

    this.authService.login(this.utilisateur)
    .subscribe(success, error);
  }
}
