import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AuthService } from 'src/services/auth.service';
import { CommandeService } from 'src/services/commande/commande.service';
import { PopupService } from 'src/services/popup.service';

@Component({
  selector: 'app-commande-fiche-ekaly',
  templateUrl: './commande-fiche-ekaly.component.html',
  styleUrls: ['./commande-fiche-ekaly.component.css']
})
export class CommandeFicheEkalyComponent implements OnInit {
  dismissReasons: any = {
    assignerLivreur: 3,
    cancel: 4
  };
  livreurs: any[] = [{
    nom: 'Rakotoarivony',
    prenom: 'Princie',
  },{
    nom: 'Rakotoarivony',
    prenom: 'Eudoxie'
  }
  ];
  showDropdown: boolean = false;
  currentLivreurIndex: number = 0; 
  searchLivreur: string = "";
  selectedLivreur: any;

  commandeEtats: any = CommandeService.commandeEtats;
  idCmd: string = "";
  cmd: any = {};
  details: any[] = [];
  constructor(private commandesService: CommandeService,
    private popupService: PopupService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.idCmd = this.activatedRoute.snapshot.params["idCmd"];
    this.refresh();
  }

  refresh(){
    this.findCmd();
  }

  findCmd(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        this.cmd = res.data;
        this.generateDetails();
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
    this.commandesService.findCmdEkalyById(this.idCmd)
    .subscribe(success, error);
  }

  formatDate(date: string){
    return moment(date).format("DD/MM/YYYY HH:mm");
  }

  generateDetails(){
    var details: any[] = [];
    this.cmd.detailsResto.forEach((elmt: any, index: number) => {
      var tab = elmt.details;
      tab[0].resto = {
        restaurant: elmt.restaurant, 
        montant: elmt.montant, 
        etat: elmt.etat,
        nbrElmt: tab.length
      };
      Array.prototype.push.apply(details, tab);
    });
    this.details = details;
  }


  //modal
  triggerModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res: any) => {
      console.log(`Closed with: ${res}`);
      if(res == this.dismissReasons.assignerLivreur){
        this.assigner();
      } 
    }, (res: any) => {
      console.log(`Dismissed ${this.getDismissReason(res)}`);
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

  livreurArrowKeyChange($event: any, increment: number){
    console.log('arrow')
    const index = this.currentLivreurIndex + increment;
    if(index < 0 || index >= this.livreurs.length) return;
    this.currentLivreurIndex = index;
  }

  focusFunction(){
    this.searchLivreurs(() => {
      this.currentLivreurIndex = 0;
      this.showDropdown = true;
    });
  }

  focusOutFunction(){
    this.showDropdown = false;
  }

  selectLivreur(){
    if(this.currentLivreurIndex < this.livreurs.length){
      this.selectedLivreur = this.livreurs[this.currentLivreurIndex];
      this.searchLivreur = this.selectedLivreur.nom + " " + this.selectedLivreur.prenom;
    }
    this.showDropdown = false;
  }

  searchLivreurs(callback: any){
    const success = (res: any) => {
      if(res.meta.status == 1){
        this.livreurs = res.data;
        callback();
      } else{
        this.popupService.showError(res.meta.message);
      }
    }
    const error = (err: any) => {
      this.popupService.showError(err.message);
    }
  
    this.authService.getLivreurs(this.searchLivreur)
    .subscribe(success, error);
  }

  assigner(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        this.refresh();
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
    this.commandesService.assigner(this.idCmd, this.selectedLivreur._id)
    .subscribe(success, error);
  }

  livreurItemClicked(index: number){
    this.currentLivreurIndex = index;
    this.selectLivreur();
  }
}
