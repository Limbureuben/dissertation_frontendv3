import {
  Component,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-leafmap',
  standalone: false,
  templateUrl: './leafmap.component.html',
  styleUrl: './leafmap.component.scss',
})
export class LeafmapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: any;
  drawnItems: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.isBrowser) {
      // Dynamically import leaflet and leaflet-draw
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
        this.drawnItems?.addLayer(layer);
        const geojson = layer.toGeoJSON();
        console.log('Drawn Polygon:', geojson);
      });
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
