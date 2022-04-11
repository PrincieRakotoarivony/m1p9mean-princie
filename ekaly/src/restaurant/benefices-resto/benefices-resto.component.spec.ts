import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficesRestoComponent } from './benefices-resto.component';

describe('BeneficesRestoComponent', () => {
  let component: BeneficesRestoComponent;
  let fixture: ComponentFixture<BeneficesRestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficesRestoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficesRestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
