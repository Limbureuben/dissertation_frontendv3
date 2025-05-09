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
    if (isPlatformBrowser(this.platformId)) {
      try {
        const L = await import('leaflet');

        this.markers = [
          {
            position: L.latLng(-6.774133, 39.230099),
            popup: 'Example Marker',
          },
        ];

        setTimeout(() => {
          if (this.mapComponent?.updateMarkers) {
            this.mapComponent.updateMarkers(this.markers);
          }
        });
      } catch (err) {
        console.error('Leaflet import failed:', err);
      }
    }
  }
}
