/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SignalrAuthService } from './signalr-auth.service';

describe('Service: SignalrAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalrAuthService]
    });
  });

  it('should ...', inject([SignalrAuthService], (service: SignalrAuthService) => {
    expect(service).toBeTruthy();
  }));
});
