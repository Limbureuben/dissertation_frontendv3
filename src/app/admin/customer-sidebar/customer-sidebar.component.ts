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
    { icon: 'dashboard', label: 'Dashboard', route: 'dash' },
    { icon: 'map', label: 'Map', route: 'map-common' },
    { icon: 'map', label: 'Booking Map', route: 'map-common' },
    { icon: 'location_on', label: 'OpenSpace', route: 'openspace' },
    { icon: 'report', label: 'Report', route: 'reports' },
    { icon: 'report', label: 'Report-USSD', route: 'report-ussd' },
    { icon: 'report', label: 'Executive', route: 'manage-wardexecutive' },
    { icon: 'history', label: 'History', route: 'history' },
    { icon: 'map', label: 'TestMap', route: 'test-map' },
    { icon: 'logout', label: 'Logout' }
  ])

  constructor(
    private authservice: AuthService
  ){}

  onLogout() {
    this.authservice.Logout()
  }

}
