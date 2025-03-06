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

  openSpaces = [
    { name: "Park A", lng: -6.658270, lat: 39.185784 },
    { name: "Park B", lng: -6.794852, lat: 39.116709 },
    { name: "Garden C", lng: -6.800974, lat: 39.079890 }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: MapStyle.STREETS,
        center: [-6.800974, 39.079890], // Center on Tokyo
        zoom: 14
      });

      // Loop through locations and add red markers
      this.openSpaces.forEach(space => {
        const marker = new Marker({ color: 'red' }) // Set marker color to red
          .setLngLat([space.lng, space.lat])
          .addTo(this.map as Map);

        // Click event to show popup or report form
        marker.getElement().addEventListener('click', () => {
          alert(`Open Space: ${space.name}\nClick to report a problem`);
        });
      });
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
