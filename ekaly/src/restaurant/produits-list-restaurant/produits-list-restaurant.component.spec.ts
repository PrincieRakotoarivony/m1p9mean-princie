import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitsListRestaurantComponent } from './produits-list-restaurant.component';

describe('ProduitsListRestaurantComponent', () => {
  let component: ProduitsListRestaurantComponent;
  let fixture: ComponentFixture<ProduitsListRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduitsListRestaurantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduitsListRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
