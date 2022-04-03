import { TestBed } from '@angular/core/testing';

import { AuthGuardRestaurantService } from './auth-guard-restaurant.service';

describe('AuthGuardRestaurantService', () => {
  let service: AuthGuardRestaurantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuardRestaurantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
