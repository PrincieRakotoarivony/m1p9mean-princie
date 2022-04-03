import { TestBed } from '@angular/core/testing';

import { AuthGuardLivreurService } from './auth-guard-livreur.service';

describe('AuthGuardLivreurService', () => {
  let service: AuthGuardLivreurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuardLivreurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
