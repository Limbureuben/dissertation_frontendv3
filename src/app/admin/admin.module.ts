import { UserModule } from './../user/user.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MapCommonComponent } from './map-common/map-common.component';
import { MapComponent } from '../user/map/map.component';
import { MapDisplayComponent } from '../user/map-display/map-display.component';
import { SharingModule } from '../sharing/sharing.module';
import { MapAdminComponent } from './map-admin/map-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    AdminFooterComponent,
    DoughnutChartComponent,
    MapCommonComponent,
    MapAdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    UserModule,
    SharingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
