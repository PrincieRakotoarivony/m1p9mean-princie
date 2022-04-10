import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { PopupService } from 'src/services/popup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  utilisateur: any = {}; 
  errors: any = {
  };

  constructor(private authService: AuthService,
    private popupService: PopupService,
    private router: Router) { }

  ngOnInit(): void {
  }

  signup(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        this.router.navigateByUrl("/login");
      } else {
        if(res.meta.errors){
          this.errors = res.meta.errors;
        } else{
          this.popupService.showError(res.message);
        }
      }
      this.popupService.stopLoading();
    };

    const error = (err: any) => {
      this.popupService.showError(err.message);
      this.popupService.stopLoading();
    };

    this.popupService.beginLoading();
    this.authService.signup(this.utilisateur)
    .subscribe(success, error);

  }
}
