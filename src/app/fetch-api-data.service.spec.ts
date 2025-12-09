import { TestBed } from '@angular/core/testing';

import { FetchApiData } from './fetch-api-data.service';

describe('FetchApiData', () => {
  let service: FetchApiData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchApiData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
