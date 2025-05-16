import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { Map, MapStyle, config } from '@maptiler/sdk';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { Marker, Popup } from '@maptiler/sdk';
import { response } from 'express';
import { switchMap } from 'rxjs/operators';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-booking-map',
  standalone: false,
  templateUrl: './booking-map.component.html',
  styleUrl: './booking-map.component.scss'
})
export class BookingMapComponent implements OnInit, AfterViewInit, OnDestroy {

  map: Map | undefined;
  searchQuery = '';
  suggestions: any[] = [];
  selectedSpace: any = null;
  openSpaces: any[] = [];
  submitting = false;

  districts: string[] = [
  'Bunju', 'Hananasif', 'Kawe','Kigogo', 'Kijitonyama', 'Kinondoni',
  'Kunduchi', 'Mabwepande', 'Magomeni', 'Makongo', 'Makumbusho',
  'Mbezi juu', 'Mbweni', 'Mikocheni', 'Msasani', 'Mwananyamala',
  'Mzimuni', 'Ndugumbi', 'Tandale', 'Wazo'
];


  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  reportForm: FormGroup;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private openSpaceService: OpenspaceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authservice: AuthService,
    private bookingService: BookingService
  ) {
    this.reportForm = this.fb.group({
      username: ['', Validators.required],
      contact: ['', Validators.required],
      date: ['', Validators.required],
      district: ['', Validators.required],
      duration: ['', Validators.required],
      purpose: ['', Validators.required],
      file: [null]
    });
  }

  ngOnInit(): void {
    config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
      this.fetchOpenSpaces();

      document.getElementById('closeFormBtn')?.addEventListener('click', () => {
        this.closeForm();
      });
    }
  }

  initializeMap(): void {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${config.apiKey}`,
      center: [39.230099, -6.774133],
      zoom: 14
    });
  }

  fetchOpenSpaces(): void {
    this.openSpaceService.getAllOpenSpacesUser().subscribe(
      (data) => {
        this.openSpaces = data;
        this.addMarkersToMap();
      },
      (error) => {
        console.error('Error fetching open spaces:', error);
      }
    );
  }

  addMarkersToMap(): void {
    this.openSpaces.forEach(space => {
      const markerElement = document.createElement('img');
      markerElement.src = 'assets/images/location.png';
      markerElement.style.width = '25px';
      markerElement.style.height = '25px';
      markerElement.style.cursor = 'pointer';

      const marker = new Marker({ element: markerElement })
        .setLngLat([space.longitude, space.latitude])
        .addTo(this.map as Map);

      const isAvailable = space.status === 'available';

      const popupContent = document.createElement('div');
      popupContent.classList.add('popup-content');
      popupContent.innerHTML = `
        <h3>${space.name}</h3>
        <p>Location: (${space.latitude}, ${space.longitude})</p>
        <p>Status: ${isAvailable ? 'Available' : 'Booked'}</p>
      `;

      const popup = new Popup({ offset: 25 }).setDOMContent(popupContent);
      marker.setPopup(popup);

      marker.getElement().addEventListener('click', () => {
        if (isAvailable) {
          this.openBookingForm(space);
        } else {
          this.toastr.warning('This space is currently booked.', 'Not Available');
        }
      });
    });
  }


  openBookingForm(space: any) {
    this.selectedSpace = space;

    const formContainer = document.getElementById('detailsForm') as HTMLElement;
    const locationName = document.getElementById('location-name') as HTMLElement;

    if (locationName) locationName.textContent = space.name;

    if (formContainer) {
      formContainer.style.display = 'flex';
      setTimeout(() => formContainer.classList.add('open'), 20);
    }
  }

  closeForm() {
    const formContainer = document.getElementById('detailsForm') as HTMLElement;
    if (formContainer) {
      formContainer.classList.add('closing');
      setTimeout(() => {
        formContainer.classList.remove('open', 'closing');
        formContainer.style.display = 'none';
      }, 300);
    }
  }

  triggerFileInput() {
    document.getElementById('file-upload')?.click();
  }

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     this.selectedFileName = file.name;
  //   }
  // }

  submitBook() {
    if (this.reportForm.invalid || !this.selectedSpace) {
      this.toastr.warning('Please fill all fields and select a space.');
      return;
    }

    this.submitting = true;

    const formData = new FormData();
    formData.append('space_id', this.selectedSpace.id.toString());
    formData.append('username', this.reportForm.value.username);
    formData.append('contact', this.reportForm.value.contact);

    const dateObj = new Date(this.reportForm.value.date);
    const formattedDate = dateObj.toISOString().split('T')[0];
    formData.append('date', formattedDate);
    formData.append('duration', this.reportForm.value.duration);
    formData.append('purpose', this.reportForm.value.purpose);
    // if (this.selectedFile) formData.append('file', this.selectedFile);

    this.bookingService.bookOpenSpace(formData).subscribe({
      next: () => {
        this.toastr.success('Booking successful!', 'Success');
        this.reportForm.reset();
        // this.selectedFile = null;
        // this.selectedFileName = '';
        this.closeForm();
        this.submitting = false;
        this.fetchOpenSpaces(); // Refresh markers
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Booking failed', 'Error');
        this.submitting = false;
      }
    });
  }

  fetchSuggestions() {
    if (!this.searchQuery) {
      this.suggestions = [];
      return;
    }

    fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=${config.apiKey}&country=TZ`)
      .then(res => res.json())
      .then(data => {
        this.suggestions = data.features.map((feature: any) => ({
          name: feature.place_name,
          center: feature.center
        }));
      })
      .catch(err => console.error("Suggestion fetch error:", err));
  }

  searchLocation() {
    if (!this.searchQuery) return;

    fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=${config.apiKey}&country=TZ`)
      .then(res => res.json())
      .then(data => {
        if (data.features.length > 0) {
          const { center } = data.features[0];
          this.map?.flyTo({ center, zoom: 14 });
        }
      })
      .catch(err => console.error("Search location error:", err));
  }

  selectSuggestion(suggestion: any) {
    this.searchQuery = suggestion.name;
    this.map?.flyTo({ center: suggestion.center, zoom: 14 });
    this.suggestions = [];
  }

  changeMapStyle(styleName: string) {
    const styleUrl = `https://api.maptiler.com/maps/${styleName}/style.json?key=${config.apiKey}`;
    this.map?.setStyle(styleUrl);
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}





























// export class BookingMapComponent implements OnInit, AfterViewInit, OnDestroy {

//   map: Map | undefined;
//   searchQuery: string = '';
//   suggestions: any[] = [];
//   selectedSpace: any = null;
//   openSpaces: any[] = [];
//   selectedFile: File | null = null;
//   submitting = false;
//   selectedFileName: string = '';

//   @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

//   reportForm: FormGroup;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private openSpaceService: OpenspaceService,
//     private fb: FormBuilder,
//     private toastr: ToastrService,
//     private authservice: AuthService,
//     private bookingService: BookingService
//   ) {
//     this.reportForm = this.fb.group({
//       username: ['', Validators.required],
//       contact: ['', Validators.required],
//       date: ['', Validators.required],
//       duration: ['', Validators.required],
//       purpose: ['', Validators.required],
//       file: [null]
//     });
//   }

//   ngOnInit(): void {
//     config.apiKey = '9rtSKNwbDOYAoeEEeW9B';
//   }

//   ngAfterViewInit() {
//     if (isPlatformBrowser(this.platformId)) {
//       this.initializeMap();
//       this.fetchOpenSpaces();

//       document.getElementById('closeFormBtn')?.addEventListener('click', () => {
//         this.closeForm();
//       });
//     }
//   }

//   initializeMap(): void {
//     this.map = new Map({
//       container: this.mapContainer.nativeElement,
//       style: 'https://api.maptiler.com/maps/streets/style.json?key=9rtSKNwbDOYAoeEEeW9B',
//       center: [39.230099, -6.774133],
//       zoom: 14
//     });
//   }

//   fetchOpenSpaces(): void {
//     this.openSpaceService.getAllOpenSpacesUser().subscribe(
//       (data) => {
//         this.openSpaces = data;
//         this.addMarkersToMap();
//       },
//       (error) => {
//         console.error('Error fetching open spaces:', error);
//       }
//     );
//   }

//   addMarkersToMap(): void {
//     this.openSpaces.forEach(space => {
//       const markerElement = document.createElement('img');
//       markerElement.src = 'assets/images/location.png';
//       markerElement.style.width = '25px';
//       markerElement.style.height = '25px';
//       markerElement.style.cursor = 'pointer';

//       const marker = new Marker({ element: markerElement })
//         .setLngLat([space.longitude, space.latitude])
//         .addTo(this.map as Map);

//       const popupContent = document.createElement('div');
//       popupContent.classList.add('popup-content');
//       popupContent.innerHTML = `
//         <h3>${space.name}</h3>
//         <p>Location: (${space.latitude}, ${space.longitude})</p>
//       `;

//       const popup = new Popup({ offset: 25 }).setDOMContent(popupContent);
//       marker.setPopup(popup);

//       marker.getElement().addEventListener('click', () => {
//         this.openBookingForm(space);
//       });
//     });
//   }

//   openBookingForm(space: any) {
//     this.selectedSpace = space;
//     const formContainer = document.getElementById('detailsForm') as HTMLElement;
//     const locationName = document.getElementById('location-name') as HTMLElement;

//     if (locationName) locationName.textContent = space.name;
//     if (formContainer) {
//       formContainer.style.display = 'flex';
//       setTimeout(() => {
//         formContainer.classList.add('open');
//       }, 20);
//     }
//   }

//   closeForm() {
//     const formContainer = document.getElementById('detailsForm') as HTMLElement;
//     if (formContainer) {
//       formContainer.classList.add('closing');
//       setTimeout(() => {
//         formContainer.classList.remove('open', 'closing');
//         formContainer.style.display = 'none';
//       }, 300);
//     }
//   }

//   triggerFileInput() {
//     document.getElementById('file-upload')?.click();
//   }

//   onFileSelected(event: any) {
//     const file: File = event.target.files[0];
//     if (file) {
//       this.selectedFile = file;
//       this.selectedFileName = file.name;
//     }
//   }

//   submitBook() {
//     if (this.reportForm.invalid) return;

//     const formData = new FormData();
//     formData.append('space_id', this.selectedSpace.id.toString());
//     formData.append('username', this.reportForm.value.username);
//     formData.append('contact', this.reportForm.value.contact);
//     const dateObj = new Date(this.reportForm.value.date);
//     const date = dateObj.toISOString().split('T')[0];
//     formData.append('date', date);
//     formData.append('duration', this.reportForm.value.duration);
//     formData.append('purpose', this.reportForm.value.purpose);
//     if (this.selectedFile) formData.append('file', this.selectedFile);

//     this.bookingService.bookOpenSpace(formData).subscribe({
//       next: () => {
//         this.toastr.success('Booking success', 'Success');
//         this.reportForm.reset();
//         this.closeForm();
//       },
//       error: (err) => {
//         console.error(err);
//         this.toastr.error('Failed to book');
//       }
//     });
//   }

//   fetchSuggestions() {
//     if (!this.searchQuery) {
//       this.suggestions = [];
//       return;
//     }

//     fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=9rtSKNwbDOYAoeEEeW9B&country=TZ`)
//       .then(res => res.json())
//       .then(data => {
//         this.suggestions = data.features.map((feature: any) => ({
//           name: feature.place_name,
//           center: feature.center
//         }));
//       })
//       .catch(err => console.error("Error fetching suggestions:", err));
//   }

//   searchLocation() {
//     if (!this.searchQuery) return;

//     fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=9rtSKNwbDOYAoeEEeW9B&country=TZ`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.features.length > 0) {
//           const { center } = data.features[0];
//           this.map?.flyTo({ center, zoom: 14 });
//         }
//       })
//       .catch(err => console.error("Error fetching location:", err));
//   }

//   selectSuggestion(suggestion: any) {
//     this.searchQuery = suggestion.name;
//     this.map?.flyTo({ center: suggestion.center, zoom: 14 });
//     this.suggestions = [];
//   }

//   changeMapStyle(styleName: string) {
//     const styleUrl = `https://api.maptiler.com/maps/${styleName}/style.json?key=9rtSKNwbDOYAoeEEeW9B`;
//     this.map?.setStyle(styleUrl);
//   }

//   ngOnDestroy() {
//     this.map?.remove();
//   }
// }
