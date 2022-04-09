import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {

  panier: any[] = [
    {qte: 2, montant: 2000, produit: {_id: "1", nom: "Ravitoto", prix: 12300}},
    {qte: 3, montant: 1500, produit: {_id: "2", nom: "Steak", prix: 25000}}
  ];
  constructor() { }

  ngOnInit(): void {
  }

  qtyPlus(index: number){
    var qte = this.panier[index].qte;
    qte += 1;
    this.panier[index].qte = qte;
  }

  qtyMinus(index: number){
    var qte = this.panier[index].qte;
    if(qte == 1) return;
      qte -= 1;
    this.panier[index].qte = qte;
  }

  removeFromCart(index: number){
    
  }
}
