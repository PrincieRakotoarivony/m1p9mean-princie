import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit(): void {
  }

  Login(){
    
  }
}
