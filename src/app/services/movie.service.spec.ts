import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';

describe('MovieService', () => {
    let service: MovieService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()]
        });
        service = TestBed.inject(MovieService);
        httpMock = TestBed.inject(HttpTestingController);
        localStorage.setItem('token', 'test-token');
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all movies', () => {
        const mockMovies = ['Movie1', 'Movie2', 'Movie3'];

        service.getAllMovies().subscribe(movies => {
        expect(movies).toEqual(mockMovies);
        });

        const req = httpMock.expectOne('YOUR_HOSTED_API_URL_HERE/movies');
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
        req.flush(mockMovies);
    });
});
