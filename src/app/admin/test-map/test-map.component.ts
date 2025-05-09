import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { Map, MapStyle, config } from '@maptiler/sdk';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-test-map',
  standalone: false,
  templateUrl: './test-map.component.html',
  styleUrl: './test-map.component.scss'
})
export class TestMapComponent implements OnInit, AfterViewInit, OnDestroy {

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

  ngAfterViewInit() {
    if (this.isBrowser) {
      const initialState = { lng: 39.230099, lat: -6.774133, zoom: 14 };

      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: MapStyle.STREETS,
        center: [initialState.lng, initialState.lat],
        zoom: initialState.zoom
      });
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      this.map?.remove();
    }
  }

}
