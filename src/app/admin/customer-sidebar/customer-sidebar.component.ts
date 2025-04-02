import { Component, signal } from '@angular/core';
import { AuthService } from '../../service/auth.service';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
}

@Component({
  selector: 'app-customer-sidebar',
  standalone: false,
  templateUrl: './customer-sidebar.component.html',
  styleUrl: './customer-sidebar.component.scss'
})
export class CustomerSidebarComponent {
  MenuItems = signal<MenuItem[]>([
    { icon: 'dashboard', label: 'Dashboard', route: 'admindashboard' },
    { icon: 'map', label: 'Map', route: 'map-common' },
    { icon: 'location_on', label: 'OpenSpace', route: 'openspace' },
    { icon: 'report', label: 'Report', route: 'reports' },
    { icon: 'history', label: 'History', route: 'history' },
    { icon: 'logout', label: 'Logout' }
  ])

  constructor(
    private authservice: AuthService
  ){}

  onLogout() {
    this.authservice.Logout()
  }

}
