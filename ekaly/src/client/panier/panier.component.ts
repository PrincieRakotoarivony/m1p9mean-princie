import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PanierService } from 'src/services/panier/panier.service';
import { PopupService } from 'src/services/popup.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {

  adresse: string = "";
  @ViewChild('addressModel', { static: false }) private addressModel : any;

  panier: any = {
    "1": {qte: 2, montant: 2000, produit: {_id: "1", nom: "Ravitoto", prix: 12300}},
    "2": {qte: 3, montant: 1500, produit: {_id: "2", nom: "Steak", prix: 25000}}
  };
  total: number = 0;
  frais: number = 0;
  fraisPanier: number = 0;

  constructor(private modalService: NgbModal,
    private panierService: PanierService,
    private popupService: PopupService,
    private storageService: StorageService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(){
    this.getPanierDetails();
  }

  qtyPlus(idProduit: string){
    var qte = this.panier[idProduit].qte;
    qte += 1;
    this.panier[idProduit].qte = qte;
    this.panierChanged();
  }

  qtyMinus(idProduit: string){
    var qte = this.panier[idProduit].qte;
    if(qte == 1) return;
      qte -= 1;
    this.panier[idProduit].qte = qte;
    this.panierChanged();
  }

  qteChanged(value: number, idProduit: string){
    if(value <= 0) this.panier[idProduit].qte = 1;
    this.panierChanged(); 
  }

  removeFromCart(idProduit: string){
    delete this.panier[idProduit];
    this.panierChanged();
  }

  triggerModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      console.log(`Closed with: ${res}`);
    }, (res) => {
      console.log(`Dismissed ${this.getDismissReason(res)}`);
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  test(){
    this.triggerModal(this.addressModel);
  }

  getKeys(object: any){
    return Object.keys(object);
  }

  getPanierDetails(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        this.panier = res.data.panier;
        this.frais = res.data.frais;
        this.panierChanged();
      } else{
        this.popupService.showError(res.meta.message);
      }
    };

    const error = (err: any) => {
      this.popupService.showError(err.message);
    };

    this.panierService.getDetailsPanier()
    .subscribe(success, error);
  }

  panierChanged(){
    var panierSession: any = {};
    Object.keys(this.panier)
    .forEach((idProduit) => {
      panierSession[idProduit] = this.panier[idProduit].qte;
    })
    this.calculTotal();
    this.storageService.setPanier(panierSession);
  }

  calculTotal(){
    var total = 0;
    const keys = Object.keys(this.panier);
    keys.forEach((idProduit) => {
      const p = this.panier[idProduit];
      p.montant = p.qte * p.produit.prix;
      total += p.montant;
      this.panier[idProduit] = p;
    });
    this.total = total;
    this.fraisPanier = 0;
    if(keys.length > 0) this.fraisPanier = this.frais;
  }
}
