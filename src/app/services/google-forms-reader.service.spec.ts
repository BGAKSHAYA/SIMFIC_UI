import { TestBed } from '@angular/core/testing';

import { GoogleFormsReaderService } from './google-forms-reader.service';

describe('GoogleFormsReaderService', () => {
  let service: GoogleFormsReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleFormsReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
