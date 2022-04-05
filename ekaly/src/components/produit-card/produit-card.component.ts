import { Component, Input, OnInit } from '@angular/core';
import { BASE_URL } from 'src/environments/environment';

@Component({
  selector: 'app-produit-card',
  templateUrl: './produit-card.component.html',
  styleUrls: ['./produit-card.component.css']
})
export class ProduitCardComponent implements OnInit {

  @Input() produit: any = {}
  constructor() { }

  ngOnInit(): void {
  }

  getUrl(path: string){
    return `${BASE_URL}/imgs/plats/${path}`;
  }

  
}
