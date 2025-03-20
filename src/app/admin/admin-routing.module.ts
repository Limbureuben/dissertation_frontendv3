import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MapCommonComponent } from './map-common/map-common.component';
import { AvailablespaceComponent } from './availablespace/availablespace.component';
import { authGuard } from '../guards/auth.guard';
import { adminGuard } from '../guards/admin.guard';
import { adminExitGuard } from '../guards/admin-exist.guard';
import { AvailablereportComponent } from './availablereport/availablereport.component';

const routes: Routes = [
  { path: 'admindashboard', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'map-common', component: MapCommonComponent },
  { path: 'openspace', component: AvailablespaceComponent },
  { path: 'report', component: AvailablereportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
