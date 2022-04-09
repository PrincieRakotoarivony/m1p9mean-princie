import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BASE_URL } from 'src/environments/environment';
import { AuthService } from 'src/services/auth.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-produit-card',
  templateUrl: './produit-card.component.html',
  styleUrls: ['./produit-card.component.css']
})
export class ProduitCardComponent implements OnInit {

  dismissReasons: any = {
    addToCart: 3,
    cancel: 4
  };
  addToCartIdProduit: string = ""; 
  addToCartQty: number = 1;
  PROFILE: any = AuthService.PROFILE;
  idProfile: string = "";
  @Input("produit") produit: any = {}
  closeModal: string = "";
  
  constructor(private storageService: StorageService,
    private modalService: NgbModal,
    private router: Router) { 
    
  }

  ngOnInit(): void {
    this.idProfile = this.storageService.getUser().profile;
  }

  getUrl(path: string){
    return `${BASE_URL}/imgs/plats/${path}`;
  }

  triggerModal(content: any, idProduit: string) {
    this.addToCartIdProduit = idProduit;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res: any) => {
      this.closeModal = `Closed with: ${res}`;
      if(res == this.dismissReasons.addToCart){
        this.addToCart();
        this.router.navigateByUrl("/panier");
      } 
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason == ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason == ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else{
      return  `with: ${reason}`;
    }
  }

  qtyPlus(){
    this.addToCartQty += 1;
  }

  qtyMinus(){
    if(this.addToCartQty == 1) return;
      this.addToCartQty -= 1;
  }

  addToCart(){
    const panier = this.storageService.getPanier();
    if(panier[this.addToCartIdProduit] != undefined){
      panier[this.addToCartIdProduit] = panier[this.addToCartIdProduit] + this.addToCartQty;
    } else{
      panier[this.addToCartIdProduit] = this.addToCartQty;
    }
    this.storageService.setPanier(panier);
  }

  qteChanged(value: number){
    if(value <= 0) this.addToCartQty = 1; 
  }

}
