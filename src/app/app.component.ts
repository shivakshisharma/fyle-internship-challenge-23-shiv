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
  totalRepos:number=10;
  totalPages: number = 1;
  totalPagesArray: number[] = [];
  totalArray:number[]=[];
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
          console.log(this.userDetails)
          this.totalRepos = this.userDetails.public_repos; // Get the total number of repos from user details
          this.calculateTotalPages();
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
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalRepos / this.pageSize);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  fetchRepositories() {
    // Set isLoadingRepos to true before fetching repositories
    this.isLoadingRepos = true;
  
    // Fetch repositories based on username
    this.apiService.getRepo(this.username, this.currentPage, this.pageSize).subscribe({
      next: (repoData: any[]) => {
       
          this.userRepos = repoData;
          // Set isLoadingRepos to false when repositories are loaded
          this.isLoadingRepos = false;
          this.isReposLoaded = true;
          // Calculate pagination info after repositories are loaded
          
          console.log(this.totalPages);
      },
      error: (error: any) => {
        console.error('Error fetching repositories:', error);
        this.isReposLoaded = false;
        // Set isLoadingRepos to false in case of error
        this.isLoadingRepos = false;
      }
    });
  }
   




 
  onPageSizeChange() {
    this.currentPage = 1; // Reset to the first page whenever page size changes
    this.calculateTotalPages();
    this.fetchRepositories();
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchRepositories();
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchRepositories();
    }
  }

  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchRepositories();
    }
  }
}