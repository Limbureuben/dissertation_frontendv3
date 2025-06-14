import { Component, signal } from '@angular/core';
import { AuthService } from '../../service/auth.service';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  color?: string;
}

@Component({
  selector: 'app-customer-sidebar',
  standalone: false,
  templateUrl: './customer-sidebar.component.html',
  styleUrl: './customer-sidebar.component.scss'
})
export class CustomerSidebarComponent {
  MenuItems = signal<MenuItem[]>([
    { icon: 'dashboard', label: 'Dashboard', route: 'dash', color: 'rgb(100, 100, 177)' },
    { icon: 'public', label: 'Map', route: 'map-common', color: 'rgb(100, 100, 177)' },
    { icon: 'place', label: 'OpenSpace', route: 'openspace', color: 'rgb(100, 100, 177)' },
    { icon: 'feedback', label: 'Report', route: 'reports', color: 'rgb(100, 100, 177)' },
    { icon: 'sms', label: 'Report-USSD', route: 'report-ussd', color: 'rgb(100, 100, 177)' },
    { icon: 'supervisor_account', label: 'Executive', route: 'manage-wardexecutive', color: 'rgb(100, 100, 177)' },
    { icon: 'history', label: 'History', route: 'history', color: 'rgb(100, 100, 177)' },
    { icon: 'booking', label: 'Booking', route: 'booking', color: 'rgb(100, 100, 177)' },
    { icon: 'logout', label: 'Logout', color: 'rgb(100, 100, 177)' }
  ])

  constructor(
    private authservice: AuthService
  ){}

  onLogout() {
    this.authservice.Logout()
  }

}
