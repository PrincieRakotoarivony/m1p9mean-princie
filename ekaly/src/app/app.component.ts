import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { PopupService } from 'src/services/popup.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  loading: boolean = false;
  title = 'ekaly';
  loggedIn: boolean = false;
  menuKey: string = "";
  menu: any = {
    NOTCONNECTED: [
      {
        nom: 'RESTAURANTS',
        lien: '/'
      },
      {
        nom: 'PLATS',
        lien: '/',
        active: true
      }
    ],
    [AuthService.PROFILE.CLIENT]: [
      {
        nom: 'RESTAURANTS',
        lien: '/'
      },
      {
        nom: 'PLATS',
        lien: '/',
        active: true
      },
      {
        nom: 'MON PANIER',
        lien: '/panier'
      },
      {
        nom: 'MES COMMANDES',
        lien: '/commandes'
      }
    ],
    [AuthService.PROFILE.RESTAURANT]: [
      {
        nom: 'PLATS',
        lien: '/restaurant',
        active: true
      },
      {
        nom: 'COMMANDES',
        lien: '/restaurant/commandes'
      }
    ],
    [AuthService.PROFILE.LIVREUR]: [
      
    ],
    [AuthService.PROFILE.EKALY]: [
      {
        nom: 'COMMANDES',
        lien: '/ekaly',
        active: true
      }
    ]
  }

  constructor(private storageService: StorageService,
    private authService: AuthService,
    private popupService: PopupService,
    private router: Router){}
  ngOnInit(): void {
    this.loggedIn = this.storageService.isLoggedIn();
    window.addEventListener('user:login',  () => {
      this.loggedIn = true;
      this.setMenu();
    });
    window.addEventListener('user:logout', () => {
      this.loggedIn = false;
      this.setMenu();
    });
    this.setMenu();
  }

  listenLoading(){
    window.addEventListener('loading:begin',  () => {
      this.loading = true;
    });
    window.addEventListener('loading:stop', () => {
      this.loading = false;
    });
  }
  
  setMenu(){
    if(this.loggedIn){
      this.menuKey = this.storageService.getUser().profile;
    } else{
      this.menuKey = "NOTCONNECTED";
    }
  }
  logout(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        window.dispatchEvent(new CustomEvent('user:logout'));
        localStorage.removeItem(StorageService.TOKEN_KEY);
        localStorage.removeItem(StorageService.USER_KEY);
        this.router.navigateByUrl("/login");
      } else {
        this.popupService.showError(res.meta.message);
      }
    };

    const error = (err: any) => {
      this.popupService.showError(err.message);
    };
    this.authService.logout()
    .subscribe(success, error);
  }
  
  clickMenuItem(index: number){
    const menuTab = this.menu[this.menuKey];
    for(let i=0; i<menuTab.length; i++){
      menuTab[i].active = false;
    }
    menuTab[index].active = true;
    this.menu[this.menuKey] = menuTab;
    this.router.navigateByUrl(menuTab[index].lien);
  }
  
  
}
