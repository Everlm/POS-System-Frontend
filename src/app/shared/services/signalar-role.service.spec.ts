/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SignalarRoleService } from './signalar-role.service';

describe('Service: SignalarRole', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalarRoleService]
    });
  });

  it('should ...', inject([SignalarRoleService], (service: SignalarRoleService) => {
    expect(service).toBeTruthy();
  }));
});
