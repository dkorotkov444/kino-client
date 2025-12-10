import { TestBed } from '@angular/core/testing';
import { ApiBaseService } from './api-base.service';

describe('ApiBaseService', () => {
  let service: ApiBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct apiUrl', () => {
    expect(service['apiUrl']).toBe('YOUR_HOSTED_API_URL_HERE/');
  });

  it('should generate auth headers with token', () => {
    localStorage.setItem('token', 'test-token');
    const headers = service['getAuthHeaders']();
    expect(headers.get('Authorization')).toBe('Bearer test-token');
    localStorage.removeItem('token');
  });
});
