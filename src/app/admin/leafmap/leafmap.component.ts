import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-leafmap',
  templateUrl: './leafmap.component.html',
  styleUrls: ['./leafmap.component.scss'],
})
export class LeafmapComponent implements AfterViewInit, OnDestroy {
  map: any;
  drawnItems: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      await import('leaflet-draw');

      this.map = L.map('map', {
        center: [39.230099, -6.774133],
        zoom: 14,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

      this.drawnItems = new L.FeatureGroup();
      this.map.addLayer(this.drawnItems);

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

      this.map.on('draw:created', (e: any) => {
        const layer = e.layer;
        this.drawnItems.addLayer(layer);
        const geojson = layer.toGeoJSON();
        console.log('Drawn Polygon:', geojson);
      });

      // ✅ Ensure the map renders correctly
      setTimeout(() => {
        this.map.invalidateSize();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
