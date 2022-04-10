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
      const before = Math.min(Math.floor((this.show-1)/2), this.page - 1);
      const after = Math.min(this.show - before, nbrPages - this.page);

      for(let i=0; i<before; i++){
        pages.push({page: this.page-(before-i), active: false})
      }
      pages.push({page: this.page, active: true})
      for(let i=0; i<after; i++){
        pages.push({page: this.page+(i+1), active: false})
      }
      
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
