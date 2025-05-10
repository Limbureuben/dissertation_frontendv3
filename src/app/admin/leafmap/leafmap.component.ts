import { Component, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MapComponent } from 'ng-leaflet-universal';

@Component({
  selector: 'app-leafmap',
  standalone: false,
  templateUrl: './leafmap.component.html',
  styleUrls: ['./leafmap.component.scss'],
})
export class LeafmapComponent implements AfterViewInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  markers: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit(): Promise<void> {
    // Ensure this runs only in the browser (not during SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      // Dynamically import Leaflet only for browser context
      const L = await import('leaflet');

      // Initialize markers
      this.markers = [
        {
          position: L.latLng(-6.774133, 39.230099),
          popup: 'Example Marker',
        },
      ];

      // Delay to ensure map component is initialized before updating markers
      setTimeout(() => {
        if (this.mapComponent?.updateMarkers) {
          this.mapComponent.updateMarkers(this.markers);
        }
      }, 0);
    } catch (error) {
      console.error('Leaflet import failed:', error);
    }
  }
}
