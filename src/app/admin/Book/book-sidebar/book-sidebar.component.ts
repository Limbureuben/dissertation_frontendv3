import { Component, signal } from '@angular/core';
import { AuthService } from '../../../service/auth.service';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
}


@Component({
  selector: 'app-book-sidebar',
  standalone: false,
  templateUrl: './book-sidebar.component.html',
  styleUrl: './book-sidebar.component.scss'
})
export class BookSidebarComponent {

  MenuItems = signal<MenuItem[]>([
    { icon: 'dashboard', label: 'Dashboard', route: 'dash' },
    { icon: 'map', label: 'Map', route: 'map-common' },
    { icon: 'location_on', label: 'OpenSpace', route: 'openspace' },
    { icon: 'report', label: 'Report', route: 'reports' },
    { icon: 'report', label: 'Report-USSD', route: 'report-ussd' },
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
