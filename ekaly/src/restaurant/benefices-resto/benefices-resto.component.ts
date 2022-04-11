import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CommandeService } from 'src/services/commande/commande.service';
import { PopupService } from 'src/services/popup.service';

@Component({
  selector: 'app-benefices-resto',
  templateUrl: './benefices-resto.component.html',
  styleUrls: ['./benefices-resto.component.css']
})
export class BeneficesRestoComponent implements OnInit {
  levels: any = ["Année", "Mois", "Date"];
  sort: any = {_id: -1};
  crt: any = {}
  count: number = 0;
  page: number = 1;
  nPerPage: number = 5;
  benefices: any[] = []
  total: any = {}
  level: number = 3;
  levelStr: string = "";
  constructor(private commandesService: CommandeService,
    private popupService: PopupService) {
      this.handlePageClick = this.handlePageClick.bind(this);
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(){
    this.findBenefices();
  }
  findBenefices(){
    const success = (res: any) => {
      if(res.meta.status == 1){
        this.benefices = res.data.commandes;
        this.count = res.data.count;
        this.total = res.data.total;
        this.levelStr = this.levels[this.level-1];
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
      sort: this.sort,
      level: this.level
    }

    this.popupService.beginLoading();
    this.commandesService.findBeneficesResto(params)
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
    this.sort = {[field]:value};
    this.refresh();
  }

  formatDateLevel(date: string){
    const tab = date.split("-");
    return tab.reverse().join("/");
  }

}
