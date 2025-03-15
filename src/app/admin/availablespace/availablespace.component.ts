import { Component, OnInit } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';

@Component({
  selector: 'app-availablespace',
  standalone: false,
  templateUrl: './availablespace.component.html',
  styleUrl: './availablespace.component.scss'
})
export class AvailablespaceComponent implements OnInit{

  openSpaces: any[] = [];
  displayedColumns: string[] = ['name', 'district', 'latitude', 'longitude', 'actions']; // Define displayed columns

  constructor(private openSpaceService: OpenspaceService) {}

  ngOnInit(): void {
    this.loadOpenSpaces();
  }

  loadOpenSpaces() {
    this.openSpaceService.getOpenSpaces().subscribe((data) => {
      this.openSpaces = data;
    });
  }


  editOpenSpace() {

  }

  deleteOpenSpace() {

  }
}
