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

  deleteOpenSpace(id: string): void {
    console.log("Deleting OpenSpace with ID:", id); // Debugging log

    this.openSpaceService.deleteOpenSpace(id).subscribe({
      next: (response) => {
        if(response.data.deleteOpenSpace.success) {
          this.toastr.success('OpenSpace deleted successfully!', 'Success', {
            positionClass: 'toast-top-right',
          });
          this.openSpaces = this.openSpaces.filter((space) => space.id !== id);
        } else {
          this.toastr.error('OpenSpace delete failed!', 'Error', {
            positionClass: 'toast-top-right',
          });
        }
      },
      error: () => {
        this.toastr.error('An error occurred while deleting OpenSpace!', 'Error', {
          positionClass: 'toast-top-right',
        });
      }
    });
}


  // deleteOpenSpace(id: string): void {
  //   this.openSpaceService.deleteOpenSpace(id).subscribe({
  //     next: (response) => {
  //       if(response.data.deleteOpenSpace.success) {
  //         this.toastr.success('Message deleted successfully!', 'Success', {
  //           positionClass: 'toast-top-right',
  //         });
  //         this.openSpaces = this.openSpaces.filter((space) => space.id !== id);
  //       } else {
  //         this.toastr.error('Message delete failed!', 'Error', {
  //           positionClass: 'toast-top-right',
  //         });
  //       }
  //     },
  //     error: () => {
  //       this.toastr.error('An error occured while delete message!', 'Error', {
  //         positionClass: 'toast-top-right',
  //       });
  //     }
  //   })
  // }
}
