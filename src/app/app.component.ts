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
  userNotFound: boolean = false;
  isLoadingUserDetails:boolean=false;
  isLoadingRepos :boolean=true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // No need to load repositories initially
  }

  getUserDetails() {
    if (this.username.trim() !== '') {
      // Reset loading states
      this.isProfileLoaded = false;
      this.isReposLoaded = false;
      this.userNotFound = false;
      this.isLoadingUserDetails = true; // New flag for loading user details

      // Fetch user details
      this.apiService.getUser(this.username).subscribe({
        next: (userData: any) => {
          this.userDetails = userData;
          this.isProfileLoaded = true;
          this.isLoadingUserDetails = false; // Update flag when user details are loaded

          // Fetch repositories after user details are loaded
          this.fetchRepositories();
        },
        error: (error: any) => {
          console.error('Error fetching user details:', error);
          this.isProfileLoaded = false;
          this.isReposLoaded = false;
          this.userNotFound = true;        
          this.isLoadingUserDetails = false; // Update flag in case of error



        }
      });
    }
  }

fetchRepositories() {
  // Set isLoadingRepos to true before fetching repositories
  this.isLoadingRepos = true;

  // Fetch repositories based on username
  this.apiService.getRepo(this.username, this.currentPage, this.pageSize).subscribe({
    next: (repoData: any[]) => {
      // Simulate a delay of 1 second (1000 milliseconds)
      setTimeout(() => {
        console.log(repoData);
        this.userRepos = repoData;
        // Set isLoadingRepos to false when repositories are loaded
        this.isLoadingRepos = false;
        this.isReposLoaded = true;

        // Calculate pagination info after repositories are loaded
        this.totalPages = Math.ceil(repoData.length / this.pageSize);
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      }, 1000); // 1000 milliseconds = 1 second
    },
    error: (error: any) => {
      console.error('Error fetching repositories:', error);
      this.isReposLoaded = false;
      // Set isLoadingRepos to false in case of error
      this.isLoadingRepos = false;
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
