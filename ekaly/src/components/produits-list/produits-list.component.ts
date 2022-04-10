import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { PopupService } from 'src/services/popup.service';
import { ProduitsService } from 'src/services/produits.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-produits-list',
  templateUrl: './produits-list.component.html',
  styleUrls: ['./produits-list.component.css']
})
export class ProduitsListComponent implements OnInit, OnChanges {

  search: string = "";
  pageNumber: number = 1;
  @Input("nPerPage") nPerPage: number = 6;
  @Input("crt") crt: any = {};
  count: number = 1; 
  
  produits: any[] = [];
  constructor(private produitsService: ProduitsService,
    private popupService: PopupService,
    private storageService: StorageService) { 
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

    const user = this.storageService.getUser();
    if(this.storageService.isLoggedIn() && user.profile == AuthService.PROFILE.RESTAURANT){
      params.crt.restaurant = user.restaurant;
    }


    const success = (res: any) => {
      if(res.meta.status == 1){
        this.produits = res.data.result;
        this.count = res.data.count;
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
    this.produitsService
    .findProduits(params)
    .subscribe(success, error);

  }

  handlePageClick(page: number){
    this.pageNumber = page;
    this.refresh();
  }



}
