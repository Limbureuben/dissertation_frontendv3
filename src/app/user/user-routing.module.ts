import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MapDisplayComponent } from './map-display/map-display.component';
import { MapComponent } from './map/map.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { authGuard } from '../guards/auth.guard';
import { adminExitGuard } from '../guards/admin-exist.guard';

const routes: Routes = [
  { path: 'user-home', component: UserHomeComponent },
  { path: 'user-dashboard', component: UserDashboardComponent},
  { path: 'map-display', component: MapDisplayComponent, canActivate: [authGuard] },
  { path: 'report-form', component: ReportFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
