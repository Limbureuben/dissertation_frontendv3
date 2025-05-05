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
    { icon: 'map', label: 'Map', route: '#' },
    { icon: 'location_on', label: 'OpenSpace', route: '#' },
    { icon: 'report', label: 'Report', route: '#' },
    { icon: 'report', label: 'Report-USSD', route: '#' },
    { icon: 'history', label: 'History', route: '#' },
    { icon: 'logout', label: 'Logout' }
  ])

  constructor(

  ){}

  onLogout() {

  }


}
