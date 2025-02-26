import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { UserFooterComponent } from './user-footer/user-footer.component';
import { MapDisplayComponent } from './map-display/map-display.component';
import { MapComponent } from './map/map.component';


@NgModule({
  declarations: [
    UserDashboardComponent,
    UserHeaderComponent,
    UserFooterComponent,
    MapDisplayComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
