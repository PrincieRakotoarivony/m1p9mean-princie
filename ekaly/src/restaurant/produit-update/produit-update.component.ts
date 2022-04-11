import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PopupService } from 'src/services/popup.service';
import { ProduitsService } from 'src/services/produits.service';

@Component({
  selector: 'app-produit-update',
  templateUrl: './produit-update.component.html',
  styleUrls: ['./produit-update.component.css']
})
export class ProduitUpdateComponent implements OnInit {

  id_produit: string = "";
  produit: any = {};
  constructor(private activateRoute: ActivatedRoute,
    private produitsService: ProduitsService,
    private popupService: PopupService,
    private router: Router) { 
      this.handleSubmit = this.handleSubmit.bind(this);
    }

  ngOnInit(): void {
    this.id_produit = this.activateRoute.snapshot.params['id_produit'];
    this.refresh();
  }

  refresh(){
    this.findProduit();
  }
  findProduit(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        this.produit = res.data;
      } else{
        this.popupService.showError(res.meta.message);
      }
    }

    const error = (err: any) => {
      this.popupService.showError(err.message);
    }
    console.log(this.id_produit);
    this.produitsService.getProduit(this.id_produit)
    .subscribe(success, error);
  }

  handleSubmit(produit: any){
    console.log(produit);
    const success = (res: any) => {
      if(res.meta.status == 1){
        this.router.navigateByUrl("/restaurant");
      } else{
        this.popupService.showError(res.meta.message);
      }
      this.popupService.stopLoading();
    }

    const error = (err: any) => {
      this.popupService.showError(err.message);
      this.popupService.stopLoading();
    }

    this.popupService.beginLoading();
    this.produitsService.updateProduit(produit)
    .subscribe(success, error);
  }

}
