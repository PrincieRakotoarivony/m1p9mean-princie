import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeFicheEkalyComponent } from './commande-fiche-ekaly.component';

describe('CommandeFicheEkalyComponent', () => {
  let component: CommandeFicheEkalyComponent;
  let fixture: ComponentFixture<CommandeFicheEkalyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandeFicheEkalyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandeFicheEkalyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
