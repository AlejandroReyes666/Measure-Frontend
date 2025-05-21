import { TestBed } from '@angular/core/testing';

import { MultiLangServiceService } from './multi-lang-service.service';

describe('MultiLangServiceService', () => {
  let service: MultiLangServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiLangServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
