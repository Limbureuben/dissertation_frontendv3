import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { UserFooterComponent } from './user-footer/user-footer.component';
import { MapDisplayComponent } from './map-display/map-display.component';
import { MapComponent } from './map/map.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    UserDashboardComponent,
    UserHeaderComponent,
    UserFooterComponent,
    MapDisplayComponent,
    MapComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class UserModule { }
