import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-produits-list-restaurant',
  templateUrl: './produits-list-restaurant.component.html',
  styleUrls: ['./produits-list-restaurant.component.css']
})
export class ProduitsListRestaurantComponent implements OnInit {

  produitsCrt: any = {};

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    const user = this.storageService.getUser();
    this.produitsCrt = {id_restaurant: user.id_restaurant};
  }

}
