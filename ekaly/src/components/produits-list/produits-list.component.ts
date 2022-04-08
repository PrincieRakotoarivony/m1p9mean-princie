import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PopupService } from 'src/services/popup.service';
import { ProduitsService } from 'src/services/produits.service';

@Component({
  selector: 'app-produits-list',
  templateUrl: './produits-list.component.html',
  styleUrls: ['./produits-list.component.css']
})
export class ProduitsListComponent implements OnInit, OnChanges {

  search: string = "";
  pageNumber: number = 1;
  @Input("nPerPage") nPerPage: number = 1;
  @Input("crt") crt: any = {};
  count: number = 1; 
  
  produits: any[] = [];
  constructor(private produitsService: ProduitsService,
    private popupService: PopupService) { 
      this.handlePageClick = this.handlePageClick.bind(this);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.refresh();
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(){
    this.getProduits();
  }
  getProduits(){
    var params = {
      search: this.search,
      page: this.pageNumber,
      nbrPerPage: this.nPerPage,
      crt: this.crt
    };

    const success = (res: any) => {
      if(res.meta.status == 1){
        this.produits = res.data.result;
        this.count = res.data.count;
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

  handlePageClick(page: number){
    this.pageNumber = page;
    this.refresh();
  }



}
