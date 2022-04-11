import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CommandeService } from 'src/services/commande/commande.service';
import { PopupService } from 'src/services/popup.service';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  idCmd: string = "";
  cmd: any = {details: []};
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
    this.commandesService.findCommande(this.idCmd)
    .subscribe(success, error);
  }

  formatDate(date: string){
    return moment(date).format("DD/MM/YYYY HH:mm");
  }

  getCommandeEtat(etat: number){
    return CommandeService.getCommandeEtatClient(etat);

  }
}
