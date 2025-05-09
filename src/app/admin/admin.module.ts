import { UserModule } from './../user/user.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
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
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { CustomerSidebarComponent } from './customer-sidebar/customer-sidebar.component';
import { DashComponent } from './dash/dash.component';
import { ReportUssdComponent } from './report-ussd/report-ussd.component';
import { RegisterWardComponent } from './Book/register-ward/register-ward.component';
import { ManagewardexecutiveComponent } from './Book/managewardexecutive/managewardexecutive.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TestMapComponent } from './test-map/test-map.component';
import { NgLeafletUniversalModule } from 'ng-leaflet-universal';
import { LeafmapComponent  } from './leafmap/leafmap.component';


@NgModule({
  declarations: [
    AdminFooterComponent,
    DoughnutChartComponent,
    MapCommonComponent,
    MapAdminComponent,
    LeafmapComponent,
    AvailablespaceComponent,
    AvailablereportComponent,
    ViewReportComponent,
    ReportHistoryComponent,
    SidebarComponent,
    CustomerSidebarComponent,
    DashComponent,
    ReportUssdComponent,
    RegisterWardComponent,
    ManagewardexecutiveComponent,
    TestMapComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    NgLeafletUniversalModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    UserModule,
    SharingModule,
    RouterOutlet,
    FormsModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatDialogModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    StoreModule.forFeature('openSpace', openSpaceReducer),
  ],
})
export class AdminModule { }
