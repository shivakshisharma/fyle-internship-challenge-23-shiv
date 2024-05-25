import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve user data from the API via GET', () => {
    const dummyUserData = { login: 'exampleUser', id: 1 };

    service.getUser('exampleUser').subscribe(user => {
      expect(user).toEqual(dummyUserData);
    });

    const req = httpTestingController.expectOne('https://api.github.com/users/exampleUser');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUserData);
  });

  it('should retrieve repositories from the API via GET', () => {
    const dummyReposData = [{ name: 'repo1' }, { name: 'repo2' }];

    service.getRepo('exampleUser', 1, 10).subscribe(repos => {
      expect(repos).toEqual(dummyReposData);
    });

    const req = httpTestingController.expectOne('https://api.github.com/users/exampleUser/repos?page=1&per_page=10');
    expect(req.request.method).toBe('GET');
    req.flush(dummyReposData);
  });
});
