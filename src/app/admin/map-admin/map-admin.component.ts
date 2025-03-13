import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Map, config, Marker, Popup } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

@Component({
  selector: 'app-map-admin',
  standalone: false,
  templateUrl: './map-admin.component.html',
  styleUrl: './map-admin.component.scss'
})
export class MapAdminComponent implements OnInit, AfterViewInit, OnDestroy {
  openSpace = {
    name: '',
    region: '',
    district: '',
    lat: 0,
    lng: 0
  }





  openSpaces: { id: number; lng: number; lat: number; name: string; region: string; district: string; marker?: Marker }[] = [];
  addingMode = false;
  marker: Marker | undefined;

  // Form Data
  openSpaceForm = { id: 0, name: '', region: '', district: '', lng: '', lat: '' };
  isFormVisible = false; // Show/Hide the form

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    config.apiKey = '9rtSKNwbDOYAoeEEeW9B';

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('editSpace', (event: any) => this.editOpenSpace(event.detail));
      window.addEventListener('deleteSpace', (event: any) => this.deleteOpenSpace(event.detail));
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: 'https://api.maptiler.com/maps/streets/style.json?key=9rtSKNwbDOYAoeEEeW9B',
        center: [39.230099, -6.774133],
        zoom: 14
      });

      this.map.on('click', (event) => {
        if (this.addingMode) {
          this.placeMarker(event.lngLat.lng, event.lngLat.lat);
        }
      });
    }
  }

  enableAddingMode() {
    this.addingMode = true;
    this.isFormVisible = true;
    this.openSpaceForm = { id: 0, name: '', region: '', district: '', lng: '', lat: '' };
  }

  placeMarker(lng: number, lat: number) {
    if (this.marker) {
      this.marker.remove();
    }

    this.marker = new Marker({ color: 'blue' })
      .setLngLat([lng, lat])
      .addTo(this.map!);

    // Bind coordinates to the form
    this.openSpaceForm.lng = lng.toString();
    this.openSpaceForm.lat = lat.toString();
  }

  submitOpenSpace() {
    const id = Date.now();
    const { name, region, district, lng, lat } = this.openSpaceForm;

    if (!name || !region || !district || !lng || !lat) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    const marker = new Marker({ color: 'red' })
      .setLngLat([parseFloat(lng), parseFloat(lat)])
      .addTo(this.map!);

    const popup = new Popup()
      .setHTML(`
        <strong>${name}</strong><br>
        ${region}, ${district} <br>
        <button onclick="if(window) window.dispatchEvent(new CustomEvent('editSpace', { detail: ${id} }))">✏️ Edit</button>
        <button onclick="if(window) window.dispatchEvent(new CustomEvent('deleteSpace', { detail: ${id} }))">🗑️ Delete</button>
      `);

    marker.setPopup(popup);

    this.openSpaces.push({ id, lng: parseFloat(lng), lat: parseFloat(lat), name, region, district, marker });

    this.isFormVisible = false;
    this.addingMode = false;
  }

  cancelAdding() {
    this.isFormVisible = false;
    this.addingMode = false;
  }

  editOpenSpace(id: number) {
    const space = this.openSpaces.find(s => s.id === id);
    if (space) {
      const newName = prompt('Edit the name of the open space:', space.name);
      if (newName) {
        space.name = newName;
        space.marker?.setPopup(
          new Popup().setHTML(`
            <strong>${newName}</strong><br>
            <button onclick="if(window) window.dispatchEvent(new CustomEvent('editSpace', { detail: ${id} }))">✏️ Edit</button>
            <button onclick="if(window) window.dispatchEvent(new CustomEvent('deleteSpace', { detail: ${id} }))">🗑️ Delete</button>
          `)
        );
      }
    }
  }

  deleteOpenSpace(id: number) {
    const index = this.openSpaces.findIndex(s => s.id === id);
    if (index !== -1) {
      this.openSpaces[index].marker?.remove();
      this.openSpaces.splice(index, 1);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('editSpace', (event: any) => this.editOpenSpace(event.detail));
      window.removeEventListener('deleteSpace', (event: any) => this.deleteOpenSpace(event.detail));
    }
  }
}
