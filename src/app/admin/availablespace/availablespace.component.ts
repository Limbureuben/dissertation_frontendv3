import { Component, OnInit } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';

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
    if (confirm('Are you sure you want to delete this open space?')) {
      this.openSpaceService.deleteOpenSpace(id).subscribe({
        next: (response) => {
          if (response.data?.deleteOpenSpace?.success) {
            this.toastr.success('Open space deleted successfully!', 'Success', {
              positionClass: 'toast-top-right',
            });
            this.loadOpenSpaces(); // Refresh table
          } else {
            this.toastr.error('Failed to delete open space.', 'Error');
          }
        },
        error: (err) => {
          console.error('Delete Error:', err);
          this.toastr.error('An error occurred while deleting.', 'Error');
        }
      });
    }
  }


}
