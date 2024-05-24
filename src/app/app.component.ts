import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  username: string = '';
  userDetails: any;
  isProfileLoaded: boolean = false;
  isReposLoaded: boolean = false;
  userRepos: any[] = [];
  repos: any[] = [];
  pageSizeOptions: number[] = [10, 20, 50, 100];
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  totalPagesArray: number[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // No need to load repositories initially
  }

  getUserDetails() {
    if (this.username.trim() !== '') {
      // Reset loading states
      this.isProfileLoaded = false;
      this.isReposLoaded = false;

      // Fetch user details
      this.apiService.getUser(this.username).subscribe({
        next: (userData: any) => {
          this.userDetails = userData;
          this.isProfileLoaded = true;
          // Fetch repositories after user details are loaded
          this.fetchRepositories();
        },
        error: (error: any) => {
          console.error('Error fetching user details:', error);
          this.isProfileLoaded = false;
          this.isReposLoaded = false;
        }
      });
    }
  }

  fetchRepositories() {
    // Fetch repositories based on username
    this.apiService.getRepo(this.username, this.currentPage, this.pageSize).subscribe({
      next: (repoData: any[]) => {
        console.log(repoData);
        this.userRepos = repoData;
        this.isReposLoaded = true;
        // Calculate pagination info after repositories are loaded
        this.totalPages = Math.ceil(repoData.length / this.pageSize);
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (error: any) => {
        console.error('Error fetching repositories:', error);
        this.isReposLoaded = false;
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    // Reload repositories for the selected page
    this.fetchRepositories();
  }
  onPageSizeChange() {
    this.fetchRepositories();
  }

  onNewerClick() {
    // Check if the current page is greater than 1
    if (this.currentPage > 1) {
      // Decrement the current page number
      this.currentPage--;
      // Load repositories for the new page
      this.fetchRepositories() ;
    }
  }
  
  onOlderClick() {
    // Check if the current page is less than the total number of pages
    if (this.currentPage < this.totalPagesArray.length) {
      // Increment the current page number
      this.currentPage++;
      // Load repositories for the new page
      this.fetchRepositories();
        
    }
  }
  
}
