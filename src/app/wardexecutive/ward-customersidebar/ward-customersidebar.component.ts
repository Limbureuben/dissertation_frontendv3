import { Component, signal } from '@angular/core';

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
    { icon: 'map', label: 'Map', route: 'map-common' },
    { icon: 'map', label: 'Booking Map', route: 'map-common' },
    { icon: 'location_on', label: 'OpenSpace', route: 'openspace' },
    { icon: 'report', label: 'Report', route: 'reports' },
    { icon: 'report', label: 'Report-USSD', route: 'report-ussd' },
    { icon: 'report', label: 'Executive', route: 'manage-wardexecutive' },
    { icon: 'history', label: 'History', route: 'history' },
    { icon: 'logout', label: 'Logout' }
  ])

  constructor(

  ){}

  onLogout() {

  }


}
