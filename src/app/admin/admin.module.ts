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
import { AvailablespaceComponent } from './availablespace/availablespace.component';
import { MatTableModule } from '@angular/material/table';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { openSpaceReducer } from '../State/open-space.reducer';
import { OpenspaceService } from '../service/openspace.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AvailablereportComponent } from './availablereport/availablereport.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportHistoryComponent } from './report-history/report-history.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    AdminFooterComponent,
    DoughnutChartComponent,
    MapCommonComponent,
    MapAdminComponent,
    AvailablespaceComponent,
    AvailablereportComponent,
    ViewReportComponent,
    ReportHistoryComponent,
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
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatDialogModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatTableModule,
    StoreModule.forFeature('openSpace', openSpaceReducer),

  ],
})
export class AdminModule { }
