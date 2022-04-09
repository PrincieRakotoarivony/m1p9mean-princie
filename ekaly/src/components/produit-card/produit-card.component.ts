import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BASE_URL } from 'src/environments/environment';
import { AuthService } from 'src/services/auth.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-produit-card',
  templateUrl: './produit-card.component.html',
  styleUrls: ['./produit-card.component.css']
})
export class ProduitCardComponent implements OnInit {

  PROFILE: any = AuthService.PROFILE;
  idProfile: string = "";
  @Input("produit") produit: any = {}
  closeModal: string = "";
  
  constructor(private storageService: StorageService,
    private modalService: NgbModal) { 
    
  }

  ngOnInit(): void {
    this.idProfile = this.storageService.getUser().profile;
  }

  getUrl(path: string){
    return `${BASE_URL}/imgs/plats/${path}`;
  }

  triggerModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
