import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingdashboardComponent } from './bookingdashboard/bookingdashboard.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    BookingdashboardComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }
