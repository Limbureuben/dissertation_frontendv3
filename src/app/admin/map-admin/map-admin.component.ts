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
export class MapAdminComponent implements OnInit {
  openSpace = {
    name: '',
    region: '',
    district: '',
    lat: 0,
    lng: 0
  }


  isAdding = false;
  map: Map | undefined;


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
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: 'https://api.maptiler.com/maps/streets/style.json?key=9rtSKNwbDOYAoeEEeW9B',
        center: [39.230099, -6.774133],
        zoom: 14
      });
  }
  }

  enableAddingMode() {
    
  }

  }
