import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CommandeService } from 'src/services/commande/commande.service';
import { PopupService } from 'src/services/popup.service';

@Component({
  selector: 'app-commande-ekaly',
  templateUrl: './commande-ekaly.component.html',
  styleUrls: ['./commande-ekaly.component.css']
})
export class CommandeEkalyComponent implements OnInit {
  commandeEtats: any = CommandeService.commandeEtats;
  sort: any = {dateCommande: -1};
  crt: any = {}
  count: number = 0;
  page: number = 1;
  nPerPage: number = 5;
  commandes: any[] = []
  constructor(private commandesService: CommandeService,
    private popupService: PopupService) {
      this.handlePageClick = this.handlePageClick.bind(this);
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(){
    this.findCommandes();
  }
  findCommandes(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        this.commandes = res.data.commandes;
        this.count = res.data.count;
      } else{
        this.popupService.showError(res.meta.message);
      }
      this.popupService.stopLoading();
    }
    const error = (err: any) => {
      this.popupService.showError(err.message);
      this.popupService.stopLoading();
    }
    const params = {
      crt: this.formatCrt(),
      page: this.page,
      nPerPage: this.nPerPage,
      sort: this.sort
    }

    this.popupService.beginLoading();
    this.commandesService.findCommandesEkaly(params)
    .subscribe(success, error);
  }

  handlePageClick(page: number){
    this.page = page;
    this.refresh();
  }

  formatDate(date: string){
    return moment(date).format("DD/MM/YYYY HH:mm");
  }

  formatCrt(){
    const crt = {...this.crt};
    if(crt.dateMin && crt.dateMin.trim() != ""){
      crt.dateMin = moment(crt.dateMin);
    }
    if(crt.dateMax && crt.dateMax.trim() != ""){
      crt.dateMax = moment(crt.dateMax + " 23:59:59.999");
    }
    return crt;
  }

  sortClick(field: string, value: number){
    console.log(field, value);
    this.sort[field] = value;
    this.refresh();
  }

}
