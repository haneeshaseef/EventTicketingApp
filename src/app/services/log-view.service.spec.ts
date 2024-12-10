import { TestBed } from '@angular/core/testing';

import { LogViewService } from './log-view.service';

describe('LogService', () => {
  let service: LogViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
