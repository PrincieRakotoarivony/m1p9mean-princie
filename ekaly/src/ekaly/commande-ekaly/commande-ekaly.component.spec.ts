import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeEkalyComponent } from './commande-ekaly.component';

describe('CommandeEkalyComponent', () => {
  let component: CommandeEkalyComponent;
  let fixture: ComponentFixture<CommandeEkalyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandeEkalyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandeEkalyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
