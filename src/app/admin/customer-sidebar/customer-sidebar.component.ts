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
    { icon: 'public', label: 'Map', route: 'map-common' },
    { icon: 'place', label: 'OpenSpace', route: 'openspace' },
    { icon: 'feedback', label: 'Report', route: 'reports' },
    { icon: 'sms', label: 'Report-USSD', route: 'report-ussd' },
    { icon: 'supervisor_account', label: 'Executive', route: 'manage-wardexecutive' },
    { icon: 'history', label: 'History', route: 'history' },
    { icon: 'explore', label: 'TestMap', route: 'test-map' },
    { icon: 'logout', label: 'Logout' }
  ])

  constructor(
    private authservice: AuthService
  ){}

  onLogout() {
    this.authservice.Logout()
  }

}
