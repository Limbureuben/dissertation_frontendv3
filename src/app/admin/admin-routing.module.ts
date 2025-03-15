import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MapCommonComponent } from './map-common/map-common.component';
import { AvailablespaceComponent } from './availablespace/availablespace.component';

const routes: Routes = [
  { path: 'admindashboard', component: AdminDashboardComponent },
  { path: 'map-common', component: MapCommonComponent },
  { path: 'openspace', component: AvailablespaceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
