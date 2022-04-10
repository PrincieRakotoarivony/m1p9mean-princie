import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CommandeService } from 'src/services/commande/commande.service';
import { PopupService } from 'src/services/popup.service';

@Component({
  selector: 'app-commande-fiche-ekaly',
  templateUrl: './commande-fiche-ekaly.component.html',
  styleUrls: ['./commande-fiche-ekaly.component.css']
})
export class CommandeFicheEkalyComponent implements OnInit {

  idCmd: string = "";
  cmd: any = {};
  details: any[] = [];
  constructor(private commandesService: CommandeService,
    private popupService: PopupService,
    private activatedRoute: ActivatedRoute) { }

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
    }
    const error = (err: any) => {
      this.popupService.showError(err.message);
    }
  
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
}
