import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { PopupService } from 'src/services/popup.service';

@Component({
  selector: 'app-mdp-oublie',
  templateUrl: './mdp-oublie.component.html',
  styleUrls: ['./mdp-oublie.component.css']
})
export class MdpOublieComponent implements OnInit {
  codeSent: boolean = false;
  params: any = {};
  constructor(private authService: AuthService,
    private popupService: PopupService,
    private router: Router) { }

  ngOnInit(): void {
  }

  mdpOublie(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        this.codeSent = true;
      } else{
        this.popupService.showError(res.meta.message);
      }
      this.popupService.stopLoading();
    };

    const error = (err: any) => {
      this.popupService.showError(err.message);
      this.popupService.stopLoading();
    };

    this.popupService.beginLoading();
    this.authService.mdpOublie(this.params.mail)
    .subscribe(success, error);
  }

  reinitMdp(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        this.router.navigateByUrl("/login");
      } else{
        this.popupService.showError(res.meta.message);
      }
      this.popupService.stopLoading();
    };

    const error = (err: any) => {
      this.popupService.showError(err.message);
      this.popupService.stopLoading();
    };

    this.popupService.beginLoading();
    this.authService.reinitMdp(this.params)
    .subscribe(success, error);
  }
}
