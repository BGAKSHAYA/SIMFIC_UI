import { TestBed } from '@angular/core/testing';

import { SessionToursService } from './session-tours.service';

describe('SessionToursService', () => {
  let service: SessionToursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionToursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
