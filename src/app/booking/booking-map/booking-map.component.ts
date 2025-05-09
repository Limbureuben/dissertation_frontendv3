import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { Map, MapStyle, config } from '@maptiler/sdk';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-booking-map',
  standalone: false,
  templateUrl: './booking-map.component.html',
  styleUrl: './booking-map.component.scss'
})
export class BookingMapComponent implements OnInit, AfterViewInit, OnDestroy {

  map: Map | undefined;
  isBrowser: boolean;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
    }
  }

  // ngAfterViewInit() {
  //   if (this.isBrowser) {
  //     const initialState = { lng: 39.230099, lat: -6.774133, zoom: 14 };

  //     this.map = new Map({
  //       container: this.mapContainer.nativeElement,
  //       style: MapStyle.STREETS,
  //       center: [initialState.lng, initialState.lat],
  //       zoom: initialState.zoom
  //     });
  //   }
  // }

  ngAfterViewInit() {
    if (this.isBrowser) {
      const initialState = { lng: 39.230099, lat: -6.774133, zoom: 14 };

      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: MapStyle.STREETS,
        center: [initialState.lng, initialState.lat],
        zoom: initialState.zoom
      });

      this.map.on('load', () => {
        this.map?.addSource('square-shape', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [39.229, -6.773],
                [39.231, -6.773],
                [39.231, -6.775],
                [39.229, -6.775],
                [39.229, -6.773]  // Close the square
              ]]
            },
            properties: {}
          }
        });

        this.map?.addLayer({
          id: 'square-fill',
          type: 'fill',
          source: 'square-shape',
          paint: {
            'fill-color': '#088',
            'fill-opacity': 0.4
          }
        });

        this.map?.addLayer({
          id: 'square-outline',
          type: 'line',
          source: 'square-shape',
          paint: {
            'line-color': '#000',
            'line-width': 2
          }
        });
      });
    }
  }


  ngOnDestroy() {
    if (this.isBrowser) {
      this.map?.remove();
    }
  }
}
