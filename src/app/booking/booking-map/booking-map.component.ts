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

import jsPDF from 'jspdf';


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

  selectedFile: File | null = null;
  selectedFileName: string = '';

  // --- New properties for PDF preview ---
  pdfBlob: Blob | null = null;
  pdfUrl: any = null;
  showPreview: boolean = false;


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
      pdfFile: [null]
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
    // Also reset preview state when closing form
    this.closePreview();
  }

  triggerFileInput() {
    document.getElementById('file-upload')?.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  submitBook() {
    if (this.reportForm.invalid || !this.selectedSpace) {
      this.toastr.warning('Please fill all fields and select a space.');
      return;
    }

    if (!this.pdfBlob) {
      this.toastr.warning('Please preview the PDF before submitting.');
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
    formData.append('district', this.reportForm.value.district);

    // Append the PDF Blob as a file
    if (this.pdfBlob) {
      formData.append('file', this.pdfBlob, 'booking-details.pdf');
    } else if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.bookingService.bookOpenSpace(formData).subscribe({
      next: () => {
        this.toastr.success('Booking successful!', 'Success');
        this.reportForm.reset();
        this.selectedFile = null;
        this.selectedFileName = '';
        this.pdfBlob = null;
        this.pdfUrl = null;
        this.showPreview = false;
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
      .catch(err => console.error("Search error:", err));
  }

  // --- PDF preview methods ---

  previewPDF() {
    if (this.reportForm.invalid) {
      this.toastr.warning('Please fill all form fields before previewing the PDF.');
      return;
    }

    const doc = new jsPDF();

    const username = this.reportForm.get('username')?.value;
    const contact = this.reportForm.get('contact')?.value;
    const date = this.reportForm.get('date')?.value;
    const district = this.reportForm.get('district')?.value;
    const duration = this.reportForm.get('duration')?.value;
    const purpose = this.reportForm.get('purpose')?.value;

    doc.setFontSize(18);
    doc.text('Booking Details', 20, 20);

    doc.setFontSize(12);
    doc.text(`Username: ${username}`, 20, 40);
    doc.text(`Contact: ${contact}`, 20, 50);
    doc.text(`Date: ${date}`, 20, 60);
    doc.text(`District: ${district}`, 20, 70);
    doc.text(`Duration: ${duration}`, 20, 80);
    doc.text(`Purpose: ${purpose}`, 20, 90);

    // Convert PDF to Blob
    const pdfOutput = doc.output('blob');
    this.pdfBlob = pdfOutput;

    // ✅ Attach PDF blob to form control
    this.reportForm.patchValue({ pdfFile: pdfOutput });

    // Create a URL for the PDF preview iframe
    this.pdfUrl = URL.createObjectURL(pdfOutput);
    this.showPreview = true;
  }


  downloadPDF() {
    if (!this.pdfBlob) {
      this.toastr.warning('Please preview the PDF first.');
      return;
    }

    const link = document.createElement('a');
    link.href = this.pdfUrl;
    link.download = 'booking-details.pdf';
    link.click();
  }

  closePreview() {
    this.showPreview = false;
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
      this.pdfUrl = null;
    }
    this.pdfBlob = null;
  }

  ngOnDestroy() {
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
    }
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

}















// export class BookingMapComponent implements OnInit, AfterViewInit, OnDestroy {

//   map: Map | undefined;
//   searchQuery = '';
//   suggestions: any[] = [];
//   selectedSpace: any = null;
//   openSpaces: any[] = [];
//   submitting = false;
//   districts: string[] = [
//   'Bunju', 'Hananasif', 'Kawe','Kigogo', 'Kijitonyama', 'Kinondoni',
//   'Kunduchi', 'Mabwepande', 'Magomeni', 'Makongo', 'Makumbusho',
//   'Mbezi juu', 'Mbweni', 'Mikocheni', 'Msasani', 'Mwananyamala',
//   'Mzimuni', 'Ndugumbi', 'Tandale', 'Wazo'
// ];


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
//       district: ['', Validators.required],
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
//       style: `https://api.maptiler.com/maps/streets/style.json?key=${config.apiKey}`,
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

//       const isAvailable = space.status === 'available';

//       const popupContent = document.createElement('div');
//       popupContent.classList.add('popup-content');
//       popupContent.innerHTML = `
//         <h3>${space.name}</h3>
//         <p>Location: (${space.latitude}, ${space.longitude})</p>
//         <p>Status: ${isAvailable ? 'Available' : 'Booked'}</p>
//       `;

//       const popup = new Popup({ offset: 25 }).setDOMContent(popupContent);
//       marker.setPopup(popup);

//       marker.getElement().addEventListener('click', () => {
//         if (isAvailable) {
//           this.openBookingForm(space);
//         } else {
//           this.toastr.warning('This space is currently booked.', 'Not Available');
//         }
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
//       setTimeout(() => formContainer.classList.add('open'), 20);
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
//     if (this.reportForm.invalid || !this.selectedSpace) {
//       this.toastr.warning('Please fill all fields and select a space.');
//       return;
//     }

//     this.submitting = true;

//     const formData = new FormData();
//     formData.append('space_id', this.selectedSpace.id.toString());
//     formData.append('username', this.reportForm.value.username);
//     formData.append('contact', this.reportForm.value.contact);

//     const dateObj = new Date(this.reportForm.value.date);
//     const formattedDate = dateObj.toISOString().split('T')[0];
//     formData.append('date', formattedDate);
//     formData.append('duration', this.reportForm.value.duration);
//     formData.append('purpose', this.reportForm.value.purpose);
//     if (this.selectedFile) formData.append('file', this.selectedFile);

//     this.bookingService.bookOpenSpace(formData).subscribe({
//       next: () => {
//         this.toastr.success('Booking successful!', 'Success');
//         this.reportForm.reset();
//         this.selectedFile = null;
//         this.selectedFileName = '';
//         this.closeForm();
//         this.submitting = false;
//         this.fetchOpenSpaces(); // Refresh markers
//       },
//       error: (err) => {
//         console.error(err);
//         this.toastr.error('Booking failed', 'Error');
//         this.submitting = false;
//       }
//     });
//   }

//   fetchSuggestions() {
//     if (!this.searchQuery) {
//       this.suggestions = [];
//       return;
//     }

//     fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=${config.apiKey}&country=TZ`)
//       .then(res => res.json())
//       .then(data => {
//         this.suggestions = data.features.map((feature: any) => ({
//           name: feature.place_name,
//           center: feature.center
//         }));
//       })
//       .catch(err => console.error("Suggestion fetch error:", err));
//   }

//   searchLocation() {
//     if (!this.searchQuery) return;

//     fetch(`https://api.maptiler.com/geocoding/${this.searchQuery}.json?key=${config.apiKey}&country=TZ`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.features.length > 0) {
//           const { center } = data.features[0];
//           this.map?.flyTo({ center, zoom: 14 });
//         }
//       })
//       .catch(err => console.error("Search location error:", err));
//   }

//   selectSuggestion(suggestion: any) {
//     this.searchQuery = suggestion.name;
//     this.map?.flyTo({ center: suggestion.center, zoom: 14 });
//     this.suggestions = [];
//   }

//   changeMapStyle(styleName: string) {
//     const styleUrl = `https://api.maptiler.com/maps/${styleName}/style.json?key=${config.apiKey}`;
//     this.map?.setStyle(styleUrl);
//   }

//   ngOnDestroy() {
//     this.map?.remove();
//   }
// }

