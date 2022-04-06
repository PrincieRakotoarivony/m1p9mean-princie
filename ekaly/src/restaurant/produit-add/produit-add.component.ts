import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopupService } from 'src/services/popup.service';
import { ProduitsService } from 'src/services/produits.service';

@Component({
  selector: 'app-produit-add',
  templateUrl: './produit-add.component.html',
  styleUrls: ['./produit-add.component.css']
})
export class ProduitAddComponent implements OnInit {

  constructor(private produitsService: ProduitsService,
    private popupService: PopupService,
    private router: Router) { 
      this.handleSubmit = this.handleSubmit.bind(this);
    }

  ngOnInit(): void {
  }

  handleSubmit(produit: any){
    console.log(produit);
    const success = (res: any) => {
      if(res.meta.status == 1){
        const id_produit = res.data;
        this.router.navigateByUrl("/restaurant");
      } else{
        this.popupService.showError(res.meta.message);
      }
    }

    const error = (err: any) => {
      this.popupService.showError(err.message);
    }

    this.produitsService.saveProduit(produit)
    .subscribe(success, error);
  }
}
