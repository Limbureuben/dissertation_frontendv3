import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MapDisplayComponent } from './map-display/map-display.component';
import { MapComponent } from './map/map.component';
import { ReportFormComponent } from './report-form/report-form.component';

const routes: Routes = [
  { path: 'user-dashboard', component: UserDashboardComponent},
  { path: 'map-display', component: MapDisplayComponent },
  { path: 'report-form', component: ReportFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
