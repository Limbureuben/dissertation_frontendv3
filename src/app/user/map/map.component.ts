import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Map, MapStyle, config, Marker, Popup } from '@maptiler/sdk';

import '@maptiler/sdk/dist/maptiler-sdk.css';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  searchQuery: string = '';
  suggestions: any[] = [];

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  openSpaces = [
    { name: "Consulting Engineering", lng: 39.185784, lat: -6.658270 },
    { name: "Msigan", lng: 39.116709, lat: -6.794852 },
    { name: "KKT Church Boko", lng: 39.144646, lat: -6.624518 },
    { name: "Bunju", lng: 39.144157, lat: -6.622651 },
    { name: "Eco Fasten", lng: 39.230099, lat: -6.774133 },
    { name: "Bora football field", lng: 39.235777, lat: -6.778251 },
    { name: "Masjid", lng: 39.233556, lat: -6.781032 },
    { name: "Mwenge", lng: 39.226800, lat: -6.768383 },
    { name: "Avan garden", lng: 39.222820, lat: -6.770813 },
    { name: "Ardhi football", lng: 39.216423, lat: -6.764396 }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: 'https://api.maptiler.com/maps/hybrid/style.json?key=9rtSKNwbDOYAoeEEeW9B',
        center: [39.230099, -6.774133],
        zoom: 14
      });

      // Ensure the map is fully loaded before adding layers
      this.map.on('load', () => {
        // Loop through locations and add red colored circles
        this.openSpaces.forEach(space => {
          // Create a GeoJSON source for each open space location
          this.map?.addSource(`open-space-source-${space.name}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [space.lng, space.lat]
              },
              properties: { name: space.name }  // Add properties field with the name of the space
            }
          });

          // Add circle layer for each open space
          this.map?.addLayer({
            id: `open-space-circle-${space.name}`,
            type: 'circle',
            source: `open-space-source-${space.name}`,
            paint: {
              'circle-radius': 10, // Radius of the circle
              'circle-color': 'rgba(255, 0, 0, 0.5)' // Red with some transparency
            }
          });

          // Add a popup when the circle is clicked
          this.map?.on('click', `open-space-circle-${space.name}`, () => {
            new Popup()
              .setLngLat([space.lng, space.lat])
              .setHTML(`<h3>${space.name}</h3><p>Click to report a problem.</p>`)
              .addTo(this.map as Map);
          });
        });
      });
    }
  }


  ngOnDestroy() {
    this.map?.remove();
  }

  // Fetch location suggestions within a specific region (Tanzania as an example)
  fetchSuggestions() {
    if (!this.searchQuery) {
      this.suggestions = [];
      return;
    }

    // Here, we're limiting the search results to Tanzania (country code 'TZ')
    fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=9rtSKNwbDOYAoeEEeW9B&country=TZ`)
      .then(res => res.json())
      .then(data => {
        this.suggestions = data.features.map((feature: any) => ({
          name: feature.place_name,
          center: feature.center
        }));
      })
      .catch(err => console.error("Error fetching suggestions:", err));
  }

  // Search for location when the button is clicked
  searchLocation() {
    if (!this.searchQuery) return;

    fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=9rtSKNwbDOYAoeEEeW9B&country=TZ`)
      .then(res => res.json())
      .then(data => {
        if (data.features.length > 0) {
          const { center } = data.features[0];
          this.map?.flyTo({ center, zoom: 14 });
        }
      })
      .catch(err => console.error("Error fetching location:", err));
  }

  // Select a suggestion from the list
  selectSuggestion(suggestion: any) {
    this.searchQuery = suggestion.name;
    this.map?.flyTo({ center: suggestion.center, zoom: 14 });
    this.suggestions = []; // Hide suggestions after selection
  }

}
