import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Business } from '../../../../models/business';
import { BusinessService } from '../../../../services/business/business.service';
import { error } from 'console';

@Component({
  selector: 'app-business-detail',
  template: `


<div class="business-detail-page container py-4" *ngIf="business; else loading">
  <!-- Business Header Section with Photo Banner -->
  <div class="business-header rounded mb-4 position-relative overflow-hidden">
    <img
      [src]="['https://upload.wikimedia.org/wikipedia/commons/0/03/Mount_Fuji_as_seen_across_lake_Kawaguchi%2C_with_Fujikawaguchiko_town_in_the_foreground_seen_early_in_the_evening._Honshu_Island._Japan.jpg']"
      alt="Business Banner"
      class="img-fluid w-100 rounded"
    />
    <div class="business-info-overlay position-absolute text-white p-3">
      <h2 class="business-name mb-1">{{ business.name }}</h2>
      <p class="business-category mb-0">
        <i class="fas fa-tags me-2"></i>{{ business.category }}
      </p>
    </div>
  </div>

  <!-- Business Information Section -->
  <div class="row">
    <div class="col-md-8">
      <!-- About the Business Section -->
      <div class="business-description bg-light rounded p-3 mb-4">
        <h5 class="mb-3">About the Business</h5>
        <p>{{ business.description }}</p>

        <!-- Rating Below the Description -->
        <!-- <div class="rating mt-2">
          <ng-container *ngFor="let star of [1, 2, 3, 4, 5]; let i = index">
            <i
              class="fas"
              [class.fa-star]="i < Math.floor(business.rating)"
              [class.fa-star-half-alt]="
                i === Math.floor(business.rating) &&
                business.rating % 1 !== 0
              "
              [class.fa-star-o]="i >= business.rating"
            ></i>
          </ng-container>
          <span class="ms-2">({{ business.rating }} / 5)</span>
        </div> -->
      </div>

      <!-- Stream Section -->
      <!-- <div class="business-stream bg-white rounded p-3">
        <h5 class="mb-3">
          <i class="fas fa-stream me-2"></i>Recent Updates
        </h5>
        <ul class="list-unstyled">
          <li *ngFor="let post of business.posts" class="mb-3">
            <div class="post-header d-flex align-items-center mb-2">
              <i class="fas fa-user-circle fa-2x me-3 text-primary"></i>
              <div>
                <p class="mb-0 fw-bold">{{ post.author }}</p>
                <small class="text-muted">{{
                  post.date | date: "short"
                }}</small>
              </div>
            </div>
            <p class="post-content">{{ post.content }}</p>
          </li>
        </ul>
      </div> -->
    </div>

    <div class="col-md-4">
      <!-- Contact and Location Section -->
      <div class="business-info bg-white rounded p-3 mb-4">
        <h5 class="mb-3">
          <i class="fas fa-info-circle me-2"></i>Details
        </h5>
        <ul class="list-unstyled">
          <li><strong>Location:</strong> {{ business.location }}</li>
          <li><strong>Contact:</strong> {{ business.contactNumber }}</li>
        </ul>
      </div>

      <!-- Call-to-Action Buttons -->
      <div class="actions">
        <button class="btn btn-primary w-100 mb-2">
          <i class="fas fa-phone-alt me-2"></i>Contact
        </button>
        <button class="btn btn-outline-secondary w-100">
          <i class="fas fa-map-marker-alt me-2"></i>Get Directions
        </button>
      </div>
    </div>
  </div>
</div>

<ng-template #loading class="loading-spinner">
    <i class="fas fa-spinner fa-spin me-2"></i> Loading...
</ng-template>




  `,
  styleUrl: './business-detail.component.scss'
})
export class BusinessDetailComponent implements OnInit {
  business!: Business;

  constructor(private route: ActivatedRoute,
              private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    // Fetch business data on route parameter change
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.getBusinessDetail(id);
    });
  }

  getBusinessDetail(id: number): void {
    this.businessService.getById(id).subscribe(
      response => {
        this.business = response;
        console.log('Business details:', this.business);
      },
      error => {
        console.error('Error in fetching business details:', error);
        this.business= this.business; // Handle the error case gracefully
      }
    );
  }

  // business = {
  //   name: 'Tech Solutions Ltd.',
  //   location: '123 Main St, Tech City',
  //   description:
  //     'Tech Solutions Ltd. is a leading provider of innovative IT solutions, offering a range of services to help businesses thrive in the digital age.',
  //   category: 'Technology Services',
  //   contactNumber: '+123 456 7890',
  //   bannerPhoto: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Mount_Fuji_as_seen_across_lake_Kawaguchi%2C_with_Fujikawaguchiko_town_in_the_foreground_seen_early_in_the_evening._Honshu_Island._Japan.jpg', // Replace with an actual photo URL
  //   rating: 4.5, // Example rating
  //   posts: [
  //     {
  //       author: 'John Doe',
  //       date: new Date(),
  //       content: 'We are excited to announce our new partnership with XYZ Corp!',
  //     },
  //     {
  //       author: 'Jane Smith',
  //       date: new Date(),
  //       content: 'Our team will be attending the upcoming Tech Expo 2024. Join us!',
  //     },
  //   ],
  // };

  // Expose Math for use in templates
  Math = Math;

}
