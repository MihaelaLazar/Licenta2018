import { TestBed, inject } from '@angular/core/testing';

import { ElasticsearchFilterService } from './elasticsearch-filter.service';

describe('ElasticsearchFilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElasticsearchFilterService]
    });
  });

  it('should be created', inject([ElasticsearchFilterService], (service: ElasticsearchFilterService) => {
    expect(service).toBeTruthy();
  }));
});
