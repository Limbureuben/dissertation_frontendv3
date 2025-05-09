import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingdashboardComponent } from './bookingdashboard/bookingdashboard.component';

const routes: Routes = [
  { path: 'booking-dashboard', component: BookingdashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
