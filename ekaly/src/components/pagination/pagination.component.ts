import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges  {

  @Input("count") count: number = 1;
  @Input("page") page: number = 1;
  @Input("nbrPerPage") nbrPerPage: number = 3;
  @Input("show") show: number = 5;
  @Input("onPageClick") onPageClick: any;

  previous: boolean = false;
  next: boolean = false;

  pages: any[] = []; 

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.initPagination();
  }

  ngOnInit(): void {
    this.initPagination();
  }

  
  initPagination(){
    const pages = [];
    var next = false;
    var previous = false;
    const nbrPages = Math.ceil(this.count/this.nbrPerPage);

    if(nbrPages > 0){ 
      const nbr = Math.min(this.show, nbrPages);
      const middleIndex = Math.floor((nbr-1)/2);
      const currentPos = Math.max(this.page-1, middleIndex);
      for(let i=0; i<nbr; i++){
        pages.push({page: this.page - (currentPos-i), active: false})
      }
      pages[currentPos].active = true;
      
      next = this.page < nbrPages;
      previous = this.page > 1;
    }
    this.pages = pages;
    this.next = next;
    this.previous = previous;
  }

  clickPage(page: number){
    if(this.onPageClick) this.onPageClick(page);
  }
}
