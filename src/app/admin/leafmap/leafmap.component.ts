import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet-draw';

@Component({
  selector: 'app-leafmap',
  standalone: false,
  templateUrl: './leafmap.component.html',
  styleUrl: './leafmap.component.scss'
})
export class LeafmapComponent implements OnInit, AfterViewInit, OnDestroy {

  map: L.Map | undefined;
  drawnItems: L.FeatureGroup | undefined;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Check if we are in the browser
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Initialize the map and Leaflet only if we're in the browser
      this.map = L.map('map', {
        center: [39.230099, -6.774133], // Default coordinates
        zoom: 14,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

      // Create a feature group for the drawn items
      this.drawnItems = new L.FeatureGroup();
      this.map.addLayer(this.drawnItems);

      // Initialize the draw control
      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: this.drawnItems,
        },
        draw: {
          polygon: true,
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
        },
      });

      this.map.addControl(drawControl);

      // Listen for the draw events
      this.map.on('draw:created', (e: any) => {
        const layer = e.layer;
        this.drawnItems?.addLayer(layer);

        // Optionally, log or send the drawn polygon to the backend
        const geojson = layer.toGeoJSON();
        console.log('Drawn Polygon:', geojson);
      });
    }
  }

  ngOnDestroy(): void {
    // Clean up the map instance if necessary
    if (this.map) {
      this.map.remove();
    }
  }
}
