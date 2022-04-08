import { Component, Input, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { PopupService } from 'src/services/popup.service';

@Component({
  selector: 'app-produit-form',
  templateUrl: './produit-form.component.html',
  styleUrls: ['./produit-form.component.css']
})
export class ProduitFormComponent implements OnInit {

  file: any;
  @Input("produit") produit: any = {};
  @Input("handleSubmit") handleSubmit : any;
  @Input("submitButtonName") submitButtonName : string = "Sauvegarder";

  constructor(private popupService: PopupService) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any){
    this.file = event.target.files[0];
  }

  convertFile(success: any, error: any){
    try{
      if(this.file){
        const max_size = 5000000;
        const allowed_types = ['image/png', 'image/jpeg'];

        if(this.file.size > max_size) 
          throw new Error("Taille maximale de l'image: 5 Mo");
        if(!allowed_types.includes(this.file.type))
          throw new Error("Sélectionnez une image");  

        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imgBase64Path = e.target.result;   
          success(imgBase64Path);
        }

        reader.onerror = (err: any) => {
          error(err);
        }
        reader.readAsDataURL(this.file);
      } else{
        success();
      }
      
    } catch(err){
      error(err);
    }
  }

  submit(){
    const success = (path: any) => {
      if(path) this.produit.img = path;
      this.handleSubmit(this.produit);
    }

    const error = (err: any) => {
      this.popupService.showError(err.message);
    }

    if(this.produit.visible == undefined) this.produit.visible = false;
    this.convertFile(success, error);
  }
}
