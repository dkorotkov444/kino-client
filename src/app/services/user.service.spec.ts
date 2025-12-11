import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()]
        });
        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should register a user', () => {
        const mockUser = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        birth_date: '1990-01-01'
        };

        service.userRegistration(mockUser).subscribe(response => {
        expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('YOUR_HOSTED_API_URL_HERE/users');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockUser);
        req.flush(mockUser);
    });
});
