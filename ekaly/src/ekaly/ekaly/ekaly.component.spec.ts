import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EkalyComponent } from './ekaly.component';

describe('EkalyComponent', () => {
  let component: EkalyComponent;
  let fixture: ComponentFixture<EkalyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EkalyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EkalyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
