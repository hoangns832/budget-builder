import { TestBed } from '@angular/core/testing';

import { BudgetBuilderService } from './budget-builder.service';

describe('BudgetBuilderService', () => {
  let service: BudgetBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
