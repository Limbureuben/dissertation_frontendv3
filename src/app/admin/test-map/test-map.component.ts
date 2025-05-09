// import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
// import { Map, MapStyle, config } from '@maptiler/sdk';
// import { isPlatformBrowser } from '@angular/common';


import { Component, ElementRef, Inject, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Map } from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';

@Component({
  selector: 'app-test-map',
  standalone: false,
  templateUrl: './test-map.component.html',
  styleUrl: './test-map.component.scss'
})
export class TestMapComponent implements OnInit, AfterViewInit, OnDestroy {

  map: Map | undefined;
  draw: MapboxDraw | undefined;
  isBrowser: boolean;

  @ViewChild('map', { static: false })
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // MapTiler API key already handled in style URL
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      const initialState = { lng: 39.230099, lat: -6.774133, zoom: 14 };

      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: 'https://api.maptiler.com/maps/streets/style.json?key=9rtSKNwbDOYAoeEEeW9B',
        center: [initialState.lng, initialState.lat],
        zoom: initialState.zoom
      });

      this.draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        }
      });

      this.map.on('load', () => {
        this.map!.addControl(this.draw!);
        this.draw!.changeMode('draw_polygon');
      });

      this.map.on('draw.create', () => this.handleDrawEvent());
      this.map.on('draw.update', () => this.handleDrawEvent());
    }
  }


  handleDrawEvent() {
    if (this.draw) {
      const geojson = this.draw.getAll();
      if (geojson.features.length > 0) {
        const polygon = geojson.features[0].geometry;
        console.log('Drawn Polygon Geometry:', polygon);
        // TODO: Send this geometry to the backend
      }
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      this.map?.remove();
    }
  }
}
