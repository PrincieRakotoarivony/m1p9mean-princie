import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommandeService } from 'src/services/commande/commande.service';
import { PanierService } from 'src/services/panier/panier.service';
import { PopupService } from 'src/services/popup.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {

  closeReasons: any = {
    commander: 3,
    annuler: 4
  }

  adresse: string = "";
  @ViewChild('addressModel', { static: false }) private addressModel : any;

  panier: any = {};
  total: number = 0;
  frais: number = 0;
  fraisPanier: number = 0;

  constructor(private modalService: NgbModal,
    private panierService: PanierService,
    private popupService: PopupService,
    private storageService: StorageService,
    private commandeService: CommandeService,
    private router: Router) { }

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
      if(res == this.closeReasons.commander){
        this.commander();
      }
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

  openCommanderModal(){
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
      this.popupService.stopLoading();
    };

    const error = (err: any) => {
      this.popupService.showError(err.message);
      this.popupService.stopLoading();
    };

    this.popupService.beginLoading();
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

  commander(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        const idCmd = res.data;
        this.storageService.setPanier({});
        this.router.navigateByUrl("/commande/"+idCmd);
      } else{
        this.popupService.showError(res.meta.message);
      }
      this.popupService.stopLoading();
    };

    const error = (err: any) => {
      this.popupService.showError(err.message);
      this.popupService.stopLoading();
    };

    const params = {
      adresse: this.adresse
    };

    this.popupService.beginLoading();
    this.commandeService.commander(params)
    .subscribe(success, error);

  }
}
