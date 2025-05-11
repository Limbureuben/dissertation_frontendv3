import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
}

@Component({
  selector: 'app-ward-customersidebar',
  standalone: false,
  templateUrl: './ward-customersidebar.component.html',
  styleUrl: './ward-customersidebar.component.scss'
})
export class WardCustomersidebarComponent {
  MenuItems = signal<MenuItem[]>([
    { icon: 'dashboard', label: 'Dashboard', route: 'dash' },
    { icon: 'map', label: 'Map', route: '#' },
    { icon: 'location_on', label: 'Booking', route: '#' },
    { icon: 'history', label: 'Processed', route: '#' },
    { icon: 'logout', label: 'Logout' }
  ])

  constructor(
    private toastr: ToastrService,
    private router: Router
  ){}

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.toastr.success('Logout success', '', {
      timeOut: 1500,
      progressBar: true,
      positionClass: 'toast-top-right'
    });
    setTimeout(() => {
      this.router.navigate(['/user-home']);
    }, 1500);
  }
}
