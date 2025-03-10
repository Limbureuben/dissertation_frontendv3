import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Map, config, Marker, Popup } from '@maptiler/sdk';
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
  locationName: string = '';

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  openSpaces = [
    {
      name: "Consulting Engineering",
      lng: 39.185784,
      lat: -6.658270,
      region: "Dar-es-salaam",
      council: "Halmashauri ya Wilaya ya Kinondoni",
      district: "Kinondoni"
    },
    {
      name: "Msigan",
      lng: 39.116709,
      lat: -6.794852,
      region: "Dar-es-salaam",
      council: "Halmashauri ya Wilaya ya Kinondoni",
      district: "Kinondoni"
    },
    {
      name: "KKT Church Boko",
      lng: 39.144646,
      lat: -6.624518,
      region: "Dar-es-salaam",
      council: "Halmashauri ya Wilaya ya Kinondoni",
      district: "Kinondoni"
    },
    {
      name: "Bunju",
      lng: 39.144157,
      lat: -6.622651,
      region: "Dar-es-salaam",
      council: "Halmashauri ya Wilaya ya Kinondoni",
      district: "Kinondoni"
    },
    {
      name: "Eco Fasten",
      lng: 39.230099,
      lat: -6.774133,
      region: "Dar-es-salaam",
      council: "Halmashauri ya Wilaya ya Kinondoni",
      district: "Kinondoni"
    },
    {
      name: "Bora football field",
      lng: 39.235777,
      lat: -6.778251,
      region: "Dar-es-salaam",
      council: "Halmashauri ya Wilaya ya Kinondoni",
      district: "Kinondoni"
    },
    {
      name: "Masjid",
      lng: 39.233556,
      lat: -6.781032,
      region: "Dar-es-salaam",
      council: "Halmashauri ya Wilaya ya Kinondoni",
      district: "Kinondoni"
    },
    {
      name: "Mwenge",
      lng: 39.226800,
      lat: -6.768383,
      region: "Dar-es-salaam",
      council: "Halmashauri ya Wilaya ya Kinondoni",
      district: "Kinondoni"
    },
    {
      name: "Avan garden",
      lng: 39.222820,
      lat: -6.770813,
      region: "Dar-es-salaam",
      council: "Halmashauri ya Wilaya ya Kinondoni",
      district: "Kinondoni"
    },
    {
      name: "Ardhi football",
      lng: 39.216423,
      lat: -6.764396,
      region: "Dar-es-salaam",
      council: "Halmashauri ya Wilaya ya Kinondoni",
      district: "Kinondoni"
    }
  ];


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: 'https://api.maptiler.com/maps/streets/style.json?key=9rtSKNwbDOYAoeEEeW9B',  // Changed to street style
        center: [39.230099, -6.774133],
        zoom: 14
      });

      // Removed controls for bottom-left
      // this.map.addControl(new NavigationControl(), 'bottom-left');
      // this.map.addControl(new GeolocateControl({
      //   positionOptions: { enableHighAccuracy: true },
      //   trackUserLocation: true
      // }), 'bottom-left');

      // Add markers
      this.openSpaces.forEach(space => {
        const markerElement = document.createElement('img');
        markerElement.src = 'assets/images/openspace.png';
        markerElement.style.width = '40px';
        markerElement.style.height = '40px';

        const marker = new Marker({ element: markerElement })
          .setLngLat([space.lng, space.lat])
          .addTo(this.map as Map);

        // Create popup with a report button
        const popupContent = document.createElement('div');
        popupContent.classList.add('popup-content');
        popupContent.innerHTML = `
          <h3>${space.name}</h3>
          <p>Location: (${space.lat}, ${space.lng})</p>
          <button class="report-problem-btn">Report Problem</button>
        `;

        const popup = new Popup({ offset: 25 })
          .setDOMContent(popupContent);

        marker.setPopup(popup);

        popupContent.querySelector('.report-problem-btn')?.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openReportForm(space); // Pass the entire space object here
        });

        marker.getElement().addEventListener('click', () => {
          this.openReportForm(space); // Pass the entire space object here
        });
      });

    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  fetchSuggestions() {
    if (!this.searchQuery) {
      this.suggestions = [];
      return;
    }

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

  selectSuggestion(suggestion: any) {
    this.searchQuery = suggestion.name;
    this.map?.flyTo({ center: suggestion.center, zoom: 14 });
    this.suggestions = [];
  }

  openReportForm(space: any) {
    const formContainer = document.getElementById('detailsForm') as HTMLElement;
    const mapWrap = document.querySelector('.map-wrap') as HTMLElement;

    // Set the Location and Region in the span elements
    (formContainer.querySelector('#location-name') as HTMLElement).textContent = space.name;
    (formContainer.querySelector('#region') as HTMLElement).textContent = 'Dar-es-salaam';
  

    formContainer.classList.add('open');
    mapWrap.classList.add('shrink');
  }



  closeForm() {
    const formContainer = document.getElementById('detailsForm') as HTMLElement;
    const mapWrap = document.querySelector('.map-wrap') as HTMLElement;

    formContainer.classList.remove('open');
    mapWrap.classList.remove('shrink');
  }

  submitReport(event: Event) {
    event.preventDefault();

    const formContainer = document.getElementById('detailsForm') as HTMLElement;
    const description = (formContainer.querySelector('#problem-description') as HTMLTextAreaElement).value;
    const locationName = (formContainer.querySelector('#location-name') as HTMLInputElement).value;
    const region = (formContainer.querySelector('#region') as HTMLInputElement).value;
    const council = (formContainer.querySelector('#council') as HTMLInputElement).value;
    const district = (formContainer.querySelector('#district') as HTMLInputElement).value;

    // You can now log, send, or process the report
    alert(`Problem reported at ${locationName} (${region}, ${council}, ${district}). Description: ${description}`);

    // Close the form after submission
    this.closeForm();
  }
}
