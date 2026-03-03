import { TestBed } from '@angular/core/testing';

import { StatusLoginService } from './status-login.service';

describe('StatusLoginService', () => {
  let service: StatusLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
