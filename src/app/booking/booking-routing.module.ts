import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingdashboardComponent } from './bookingdashboard/bookingdashboard.component';
import { BookingMapComponent } from './booking-map/booking-map.component';

const routes: Routes = [
  { path: 'booking-dashboard', component: BookingdashboardComponent },
  { path: 'booking-map', component: BookingMapComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
