import { TestBed } from '@angular/core/testing';

import { PermissionDeniedRedirectService } from './permission-denied-redirect.service';

describe('PermissionDeniedRedirectService', () => {
  let service: PermissionDeniedRedirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionDeniedRedirectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
