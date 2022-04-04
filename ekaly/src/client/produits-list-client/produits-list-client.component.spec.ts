import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitsListClientComponent } from './produits-list-client.component';

describe('ProduitsListClientComponent', () => {
  let component: ProduitsListClientComponent;
  let fixture: ComponentFixture<ProduitsListClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduitsListClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduitsListClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
