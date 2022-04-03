import { TestBed } from '@angular/core/testing';

import { AuthGuardEkalyService } from './auth-guard-ekaly.service';

describe('AuthGuardEkalyService', () => {
  let service: AuthGuardEkalyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuardEkalyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
