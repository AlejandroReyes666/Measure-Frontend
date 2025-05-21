import { TestBed } from '@angular/core/testing';

import { MasureService } from './masure.service';

describe('MasureService', () => {
  let service: MasureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
