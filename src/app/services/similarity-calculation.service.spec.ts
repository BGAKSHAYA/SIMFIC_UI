import { TestBed } from '@angular/core/testing';

import { SimilarityCalculationService } from './similarity-calculation.service';

describe('SimilarityCalculationService', () => {
  let service: SimilarityCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimilarityCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
