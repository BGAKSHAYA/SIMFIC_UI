import { TestBed } from '@angular/core/testing';

import { ReadfilesService } from './readfiles.service';

describe('ReadfilesService', () => {
  let service: ReadfilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
