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
export class MapAdminComponent implements OnInit, AfterViewInit {
  map: Map | undefined;
  openSpaces: { id: number; lng: number; lat: number; name: string; marker?: Marker }[] = [];
  addingMode = false;
  selectedSpace: any = null;

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    config.apiKey = '9rtSKNwbDOYAoeEEeW9B';

    window.addEventListener('editSpace', (event: any) => this.editOpenSpace(event.detail));
    window.addEventListener('deleteSpace', (event: any) => this.deleteOpenSpace(event.detail));
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
          this.addOpenSpace(event.lngLat.lng, event.lngLat.lat);
        }
      });
    }
  }

  enableAddingMode() {
    this.addingMode = true;
    alert('Click on the map to add a new open space');
  }

  addOpenSpace(lng: number, lat: number) {
    const id = Date.now();
    const name = prompt('Enter the name of the open space:', 'New Open Space') || 'Unnamed Open Space';

    const marker = new Marker({ color: 'red' })
      .setLngLat([lng, lat])
      .addTo(this.map!);

    const popup = new Popup()
      .setHTML(`
        <strong>${name}</strong><br>
        <button onclick="window.dispatchEvent(new CustomEvent('editSpace', { detail: ${id} }))">✏️ Edit</button>
        <button onclick="window.dispatchEvent(new CustomEvent('deleteSpace', { detail: ${id} }))">🗑️ Delete</button>
      `);
    marker.setPopup(popup);

    this.openSpaces.push({ id, lng, lat, name, marker });
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
            <button onclick="window.dispatchEvent(new CustomEvent('editSpace', { detail: ${id} }))">✏️ Edit</button>
            <button onclick="window.dispatchEvent(new CustomEvent('deleteSpace', { detail: ${id} }))">🗑️ Delete</button>
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
    window.removeEventListener('editSpace', (event: any) => this.editOpenSpace(event.detail));
    window.removeEventListener('deleteSpace', (event: any) => this.deleteOpenSpace(event.detail));
  }
}
