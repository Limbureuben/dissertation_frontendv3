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
    const formattedDate = dateObj.toISOString().split('T')[0]; // Format: yyyy-mm-dd
    formData.append('date', formattedDate);
    formData.append('duration', this.reportForm.value.duration);
    formData.append('purpose', this.reportForm.value.purpose);
    formData.append('district', this.reportForm.value.district);

    const fileToAttach = this.pdfBlob || this.selectedFile;
    if (fileToAttach) {
      const fileName = this.pdfBlob ? 'booking-details.pdf' : this.selectedFileName || 'uploaded-file.pdf';
      formData.append('file', fileToAttach, fileName);
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

    const formattedDate = new Date(date).toLocaleDateString();

    // Header
    doc.setFontSize(16);
    doc.setTextColor(63, 81, 181);
    doc.setFont("helvetica", "bold");
    doc.text("KINONDONI MUNICIPAL PUBLIC OPENSPACE MANAGEMENT", 105, 20, { align: "center" });

    doc.setTextColor(0, 0, 0);

    // Divider line
    doc.setDrawColor(0);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`From: ${username}`, 20, 35);
    doc.text("Through: Ward Executive Officer", 20, 42);
    doc.text("To: Kinondoni Municipal Staff", 20, 49);

    // Section: Booking Information
    doc.setFont("helvetica", "bold");
    doc.text("Booking Information:", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Username: ${username}`, 20, 68);
    doc.text(`Contact: ${contact}`, 20, 75);
    doc.text(`Ward: ${district}`, 20, 82);
    doc.text(`Booking Date: ${formattedDate}`, 20, 89);
    doc.text(`Duration: ${duration}`, 20, 96);
    doc.text(`Purpose: ${purpose}`, 20, 103);

    // Section: Sending Details
    doc.setFont("helvetica", "bold");
    doc.text("Submission Details:", 20, 115);
    doc.setFont("helvetica", "normal");
    doc.text(`Date of Sending: ${new Date().toLocaleDateString()}`, 20, 123);

    // Section: Digital Signature
    doc.setFont("helvetica", "bold");
    doc.text("User Signature:", 20, 135);
    doc.setFont("helvetica", "italic");
    doc.text(`${username}`, 60, 135);

    // Decorative Footer Line
    doc.setDrawColor(150);
    doc.line(20, 280, 190, 280);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Managed by Kinondoni Municipal Council – Digital Booking System", 105, 285, { align: "center" });

    // Convert to blob and preview
    setTimeout(() => {
      const pdfBlob = doc.output('blob');
      const file = new File([pdfBlob], 'booking-details.pdf', { type: 'application/pdf' });

      this.pdfBlob = pdfBlob;
      this.reportForm.patchValue({ pdfFile: file });

      if (this.pdfUrl) {
        URL.revokeObjectURL(this.pdfUrl);
      }

      this.pdfUrl = URL.createObjectURL(pdfBlob);
      this.showPreview = true;
    }, 0);
  }



  downloadPDF() {
    if (this.reportForm.invalid) {
      this.toastr.warning('Please fill all form fields before downloading the PDF.');
      return;
    }

    const doc = new jsPDF();
    const leftColX = 20;
    const rightColX = 80;
    let currentY = 30;

    const username = this.reportForm.get('username')?.value;
    const contact = this.reportForm.get('contact')?.value;
    const date = this.reportForm.get('date')?.value;
    const district = this.reportForm.get('district')?.value;
    const duration = this.reportForm.get('duration')?.value;
    const purpose = this.reportForm.get('purpose')?.value;

    const formattedDate = new Date(date).toLocaleDateString();
    const sendingDate = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("KINONDONI OPENSPACE MANAGEMENT MUNICIPAL", 105, 15, { align: "center" });

    // Divider
    doc.setDrawColor(0);
    doc.line(20, 20, 190, 20);

    // Booking Flow (Two-sided)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("FROM:", leftColX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text("User", rightColX, currentY);
    currentY += 8;

    doc.setFont("helvetica", "bold");
    doc.text("THROUGH:", leftColX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text("Ward Executive Officer", rightColX, currentY);
    currentY += 8;

    doc.setFont("helvetica", "bold");
    doc.text("TO:", leftColX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text("Kinondoni Municipal Staff", rightColX, currentY);
    currentY += 15;

    // Booking Details
    doc.setFont("helvetica", "bold");
    doc.text("USERNAME:", leftColX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(username, rightColX, currentY);
    currentY += 8;

    doc.setFont("helvetica", "bold");
    doc.text("CONTACT:", leftColX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(contact, rightColX, currentY);
    currentY += 8;

    doc.setFont("helvetica", "bold");
    doc.text("WARD:", leftColX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(district, rightColX, currentY);
    currentY += 8;

    doc.setFont("helvetica", "bold");
    doc.text("BOOKING DATE:", leftColX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(formattedDate, rightColX, currentY);
    currentY += 8;

    doc.setFont("helvetica", "bold");
    doc.text("DURATION:", leftColX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(duration, rightColX, currentY);
    currentY += 8;

    doc.setFont("helvetica", "bold");
    doc.text("PURPOSE:", leftColX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(purpose, rightColX, currentY);
    currentY += 15;

    // Sending Date
    doc.setFont("helvetica", "bold");
    doc.text("SENDING DATE:", leftColX, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(sendingDate, rightColX, currentY);
    currentY += 15;

    // Signature
    doc.setFont("helvetica", "bold");
    doc.text("USER SIGNATURE:", leftColX, currentY);
    doc.setFont("helvetica", "italic");
    doc.text(username, rightColX, currentY);
    currentY += 15;

    // Footer
    doc.setDrawColor(150);
    doc.line(20, 280, 190, 280);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("Managed by Kinondoni Municipal Council – Digital Booking System", 105, 285, { align: "center" });

    // Create PDF Blob for uploading
    this.pdfBlob = doc.output('blob');

    // Trigger download
    doc.save('booking-details.pdf');

    this.toastr.success('PDF downloaded successfully.');
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

