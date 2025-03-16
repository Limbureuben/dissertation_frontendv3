import { Component, OnInit } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { response } from 'express';

@Component({
  selector: 'app-availablespace',
  standalone: false,
  templateUrl: './availablespace.component.html',
  styleUrl: './availablespace.component.scss'
})
export class AvailablespaceComponent implements OnInit{

  openSpaces: any[] = [];
  displayedColumns: string[] = ['name', 'district', 'latitude', 'longitude', 'actions']; // Define displayed columns

  constructor(
    private openSpaceService: OpenspaceService,
    private toastr: ToastrService
  ) {}

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

  deleteOpenSpace(id: string) {
    if (!id) {
      console.error('Error: ID is undefined or null'); // Debugging
      return;
    }

    if (confirm('Are you sure you want to delete this open space?')) {
      this.openSpaceService.deleteOpenSpace(id).subscribe(
        (response) => {
          console.log('GraphQL Response:', response); // Debugging log
          if (response.data.deleteOpenSpace.success) {
            console.log('Deleted:', response.data.deleteOpenSpace.message);
            this.openSpaces = this.openSpaces.filter(space => space.id !== id);
          } else {
            console.error('Deletion failed:', response.data.deleteOpenSpace.message);
          }
        },
        (error) => {
          console.error('GraphQL Error:', error);
        }
      );
    }
  }


}
