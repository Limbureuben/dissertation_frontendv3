import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Map, MapStyle, config, Marker } from '@maptiler/sdk';

import '@maptiler/sdk/dist/maptiler-sdk.css';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };

      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: MapStyle.STREETS,
        center: [initialState.lng, initialState.lat],
        zoom: initialState.zoom
      });

      // Add marker
      const marker = new Marker()
        .setLngLat([139.753, 35.6844]) // Set coordinates for the marker
        .addTo(this.map); // Add marker to map

      // Add click event to the marker
      marker.getElement().addEventListener('click', () => {
        this.showReportForm(); // Show the form when marker is clicked
      });
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  showReportForm() {
    // Code to display a form for the user to report the issue
    alert("Form will pop up here for reporting.");
    // You can trigger a modal or a form dialog here
  }
}
