import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Map, Marker, config } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Router } from '@angular/router';

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
  marker: Marker | null = null;

  clickedLat: number | null = null;
  clickedLng: number | null = null;

  districts: string[] = ['Kinondoni', 'Ilala', 'Ubungo', 'Temeke', 'Kigamboni'];

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log("Running in the browser. Initializing API key.");
      config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: 'https://api.maptiler.com/maps/streets/style.json?key=9rtSKNwbDOYAoeEEeW9B',
        center: [39.230099, -6.774133],
        zoom: 14
      });

      // Listen for click events on the map
      this.map.on('click', (event) => {
        const { lng, lat } = event.lngLat;
        this.clickedLat = lat;
        this.clickedLng = lng;

        // Remove previous marker if it exists
        if (this.marker) {
          this.marker.remove();
        }

        // Create a small black marker and add it to the map
        this.marker = new Marker({ color: 'black', scale: 0.6 }) // Small black marker
          .setLngLat([lng, lat])
          .addTo(this.map!);
      });
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
    this.router.navigate(['/admindashboard'])
  }
}
