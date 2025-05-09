import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingdashboardComponent } from './bookingdashboard/bookingdashboard.component';
import { BookingHeaderComponent } from './booking-header/booking-header.component';


@NgModule({
  declarations: [
    BookingdashboardComponent,
    BookingHeaderComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }
