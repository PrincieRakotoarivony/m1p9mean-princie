import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CommandeService } from 'src/services/commande/commande.service';
import { PopupService } from 'src/services/popup.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-commande-resto',
  templateUrl: './commande-resto.component.html',
  styleUrls: ['./commande-resto.component.css']
})
export class CommandeRestoComponent implements OnInit {
  commandeEtats: any = CommandeService.commandeEtats;
  idCmd: string = "";
  cmd: any = {detailsResto: {details: []}, clientObj: {}};
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
    this.commandesService.findCommandeRestoById(this.idCmd)
    .subscribe(success, error);
  }

  formatDate(date: string){
    return moment(date).format("DD/MM/YYYY HH:mm");
  }

  changeEtat(etat: number){
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
    this.commandesService.changerEtatCmdResto(this.idCmd, etat)
    .subscribe(success, error);
  }

  
}
