import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingdashboardComponent } from './bookingdashboard/bookingdashboard.component';


@NgModule({
  declarations: [
    BookingdashboardComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }
