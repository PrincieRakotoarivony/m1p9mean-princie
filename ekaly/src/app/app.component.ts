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
  title = 'ekaly';
  loggedIn: boolean = false;

  constructor(private storageService: StorageService,
    private authService: AuthService,
    private popupService: PopupService,
    private router: Router){}
  ngOnInit(): void {
    this.loggedIn = this.storageService.isLoggedIn();
    window.addEventListener('user:login',  () => {
      this.loggedIn = true;
    });
    window.addEventListener('user:logout', () => {
      this.loggedIn = false;
    });
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
  
  
  
}
