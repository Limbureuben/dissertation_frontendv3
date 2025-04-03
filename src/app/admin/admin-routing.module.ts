import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MapCommonComponent } from './map-common/map-common.component';
import { AvailablespaceComponent } from './availablespace/availablespace.component';
import { authGuard } from '../guards/auth.guard';
import { adminGuard } from '../guards/admin.guard';
import { adminExitGuard } from '../guards/admin-exist.guard';
import { AvailablereportComponent } from './availablereport/availablereport.component';
import { ReportHistoryComponent } from './report-history/report-history.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashComponent } from './dash/dash.component';

// const routes: Routes = [
//   { path: 'admindashboard', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
//   { path: 'map-common', component: MapCommonComponent },
//   { path: 'openspace', component: AvailablespaceComponent },
//   { path: 'reports', component: AvailablereportComponent },
//   { path: 'history', component: ReportHistoryComponent },
//   { path: 'sidebar', component: SidebarComponent },
//   { path: 'sidebartwo', component: SidebartwoComponent }
// ];

const routes: Routes = [
  {
    path: 'admin',
    component: SidebarComponent,  // Wraps all admin routes
    canActivate: [authGuard, adminGuard],
    children: [
      { path: 'admindashboard', component: AdminDashboardComponent },
      { path: 'map-common', component: MapCommonComponent },
      { path: 'openspace', component: AvailablespaceComponent },
      { path: 'reports', component: AvailablereportComponent },
      { path: 'history', component: ReportHistoryComponent },
      { path: 'dash', component: DashComponent },
      { path: '', redirectTo: 'admindashboard', pathMatch: 'full' } // Default route
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
