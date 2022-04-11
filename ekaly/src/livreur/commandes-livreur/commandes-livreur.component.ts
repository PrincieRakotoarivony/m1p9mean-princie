import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CommandeService } from 'src/services/commande/commande.service';
import { PopupService } from 'src/services/popup.service';

@Component({
  selector: 'app-commandes-livreur',
  templateUrl: './commandes-livreur.component.html',
  styleUrls: ['./commandes-livreur.component.css']
})
export class CommandesLivreurComponent implements OnInit {
  
  

  items : any = [
    [], [], []
  ];

  status : any = [true, true, true];

  constructor(private popupService: PopupService,
    private commandeService: CommandeService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(){
    this.popupService.beginLoading();
    this.findCommandes(0, {etat: 3});
    this.findCommandes(1, {etat: 4});
    this.findCommandes(2, {etat: 5});
  }
  async findCommandes(index: number, params: any){
    this.status[index] = false;
    try{
      const res: any = await this.commandeService.findCommandesLivreur(params).toPromise();
      if(res.meta.status == 1){
        this.items[index] = res.data;
      } else{
        throw new Error(res.meta.message);
      }
    } catch(err: any){
      this.popupService.showError(err.message);
    } finally{
      this.status[index] = true;
      this.checkLoading();
    }
  }

  checkLoading(){
    var check = true;
    for(let i=0; i<this.status.length; i++){
      if(!this.status[i]) {
        check = false;
        break;
      }
    }
    if(check) this.popupService.stopLoading();
  }
    
onItemDrop(e: any, index: number) {
  const data = e.dragData;
  var fromTab = this.items[data.fromIndex];
  fromTab.splice(data.itemIndex, 1);
  this.items[data.fromIndex] = fromTab;
  this.items[index].unshift(data.item);
  data.item.load = true;
  const success = (res: any) => {
    data.item.err = false;
    if(res.meta.status != 1){
      data.item.err = true;
      this.popupService.showError(res.meta.message);
    } 
    data.item.load = false;
  }

  const error = (err: any) => {
    data.item.err = true;
    data.item.load = false;
    this.popupService.showError(err.message);
  }

  this.commandeService.setEtatLivraison(data.item._id, index+3)
  .subscribe(success, error);
}


formatDate(date: string){
  return moment(date).format("DD/MM/YYYY HH:mm");
}

}
