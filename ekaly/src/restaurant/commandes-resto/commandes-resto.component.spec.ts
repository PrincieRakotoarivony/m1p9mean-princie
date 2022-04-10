import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandesRestoComponent } from './commandes-resto.component';

describe('CommandesRestoComponent', () => {
  let component: CommandesRestoComponent;
  let fixture: ComponentFixture<CommandesRestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandesRestoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandesRestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
