import { TestBed } from '@angular/core/testing';

import { TopkresultsService } from './topkresults.service';

describe('TopkresultsService', () => {
  let service: TopkresultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopkresultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
