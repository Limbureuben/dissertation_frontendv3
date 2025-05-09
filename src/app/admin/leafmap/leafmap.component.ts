import { Component, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MapComponent } from 'ng-leaflet-universal';

@Component({
  selector: 'app-leafmap',
  templateUrl: './leafmap.component.html',
  styleUrls: ['./leafmap.component.scss'],
})
export class LeafmapComponent implements AfterViewInit {

  @ViewChild(MapComponent) mapComponent!: MapComponent;

  // Define markers as any[]
  markers: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Example marker
      this.markers = [
        {
          position: [-6.774133, 39.230099],
          popup: 'Example Marker',
        },
      ];

      // Ensure update happens after view is initialized
      setTimeout(() => {
        this.mapComponent.updateMarkers(this.markers);
      });
    }
  }
}
