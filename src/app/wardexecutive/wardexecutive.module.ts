import { WardSidebarComponent } from './ward-sidebar/ward-sidebar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WardexecutiveRoutingModule } from './wardexecutive-routing.module';
import { WarddashboardComponent } from './warddashboard/warddashboard.component';
import { WardCustomersidebarComponent } from './ward-customersidebar/ward-customersidebar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UserModule } from '../user/user.module';
import { SharingModule } from '../sharing/sharing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    WarddashboardComponent,
    WardCustomersidebarComponent,
    WardSidebarComponent,
  ],
  imports: [
    CommonModule,
    WardexecutiveRoutingModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
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
    UserModule,
    SharingModule,
  ],
  exports: [WardSidebarComponent]
})
export class WardexecutiveModule { }
