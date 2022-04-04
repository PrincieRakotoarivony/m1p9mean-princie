import { Component, Input, OnInit } from '@angular/core';
import { PopupService } from 'src/services/popup.service';
import { ProduitsService } from 'src/services/produits.service';

@Component({
  selector: 'app-produits-list',
  templateUrl: './produits-list.component.html',
  styleUrls: ['./produits-list.component.css']
})
export class ProduitsListComponent implements OnInit {

  search: string = "";
  pageNumber: number = 1;
  @Input("nPerPage") nPerPage: number = 2;
  @Input("crt") crt: any = {};
  
  produits: any[] = [];
  constructor(private produitsService: ProduitsService,
    private popupService: PopupService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(){
    this.getProduits();
  }
  getProduits(){
    var params = {
      search: this.search,
      pageNumber: this.pageNumber,
      nPerPage: this.nPerPage,
      crt: this.crt
    };

    const success = (res: any) => {
      if(res.meta.status == 1){
        this.produits = res.data;
      } else{
        this.popupService.showError(res.meta.message);
      }
    };

    const error = (err: any) => {
      this.popupService.showError(err.message);
    };

    this.produitsService
    .findProduits(params)
    .subscribe(success, error);

  }

}
