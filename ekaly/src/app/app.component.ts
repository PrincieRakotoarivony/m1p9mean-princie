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
  menuClosed: boolean = false;
  loading: boolean = false;
  title = 'ekaly';
  loggedIn: boolean = false;
  menuKey: string = "";
  indexMenuActive: number = 0; 
  menu: any = {
    NOTCONNECTED: null,
    [AuthService.PROFILE.CLIENT]: [
      {
        nom: 'PLATS',
        lien: '/'
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
        lien: '/restaurant'
      },
      {
        nom: 'COMMANDES',
        lien: '/restaurant/commandes'
      },
      {
        nom: 'BENEFICES',
        lien: '/restaurant/benefices'
      }
    ],
    [AuthService.PROFILE.LIVREUR]: [
      {
        nom: 'COMMANDES',
        lien: '/'
      },
    ],
    [AuthService.PROFILE.EKALY]: [
      {
        nom: 'COMMANDES',
        lien: '/ekaly'
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
    window.addEventListener('resize', () => {this.setMenuClosedOnWindowResizing();})
    this.setMenu();
    this.listenLoading();
    this.setMenuClosedOnWindowResizing();
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
    this.indexMenuActive = 0;
  }
  logout(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        window.dispatchEvent(new CustomEvent('user:logout'));
        localStorage.removeItem(StorageService.TOKEN_KEY);
        localStorage.removeItem(StorageService.USER_KEY);
        localStorage.removeItem(StorageService.PANIER_KEY);
        this.router.navigateByUrl("/login");
      } else {
        this.popupService.showError(res.meta.message);
      }
      this.popupService.stopLoading();
    };

    const error = (err: any) => {
      this.popupService.showError(err.message);
      this.popupService.stopLoading();
    };

    this.popupService.beginLoading();
    this.authService.logout()
    .subscribe(success, error);
  }
  
  clickMenuItem(index: number){
    const menuTab = this.menu[this.menuKey];
    this.indexMenuActive = index;
    this.router.navigateByUrl(menuTab[index].lien);
  }
  
  closeMenu(){
    this.menuClosed = true;
  }
  toogleMenu(){
    this.menuClosed = !this.menuClosed;
  }
  
  setMenuClosedOnWindowResizing(){
    this.menuClosed = window.innerWidth < 1000;
  }
}
