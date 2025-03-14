import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Map, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

@Component({
  selector: 'app-map-admin',
  standalone: false,
  templateUrl: './map-admin.component.html',
  styleUrl: './map-admin.component.scss'
})
export class MapAdminComponent implements OnInit {
  map: Map | undefined;
  showForm: boolean = false;
  lat: string = '';
  lng: string = '';
  region: string = '';
  district: string = '';

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log("Running in the browser. Initializing API key.");
      config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log("Initializing Map...");
      setTimeout(() => {
        this.map = new Map({
          container: this.mapContainer.nativeElement,
          style: 'https://api.maptiler.com/maps/streets/style.json?key=9rtSKNwbDOYAoeEEeW9B',
          center: [39.230099, -6.774133],
          zoom: 14
        });
      }, 500); // Delay to ensure the DOM is ready
    }
  }


  enableAddingMode() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  submitForm() {
    console.log('Open Space Data:', {
      latitude: this.lat,
      longitude: this.lng,
      region: this.region,
      district: this.district
    });

    this.closeForm();
  }

  goBack() {
    console.log('Going back...');
    // Add logic to navigate back if needed
  }
}
