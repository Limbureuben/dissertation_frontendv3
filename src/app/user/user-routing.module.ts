import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MapDisplayComponent } from './map-display/map-display.component';
import { MapComponent } from './map/map.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { UserHomeComponent } from './user-home/user-home.component';

const routes: Routes = [
  { path: 'user-dashboard', component: UserDashboardComponent},
  { path: 'map-display', component: MapDisplayComponent },
  { path: 'report-form', component: ReportFormComponent },
  { path: 'user-home', component: UserHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
