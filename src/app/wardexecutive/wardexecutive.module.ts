import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WardexecutiveRoutingModule } from './wardexecutive-routing.module';
import { PasswordchangeComponent } from './passwordchange/passwordchange.component';
import { LoginComponent } from './login/login.component';
import { WarddashboardComponent } from './warddashboard/warddashboard.component';
import { WardSidebarComponent } from './ward-sidebar/ward-sidebar.component';
import { WardCustomersidebarComponent } from './ward-customersidebar/ward-customersidebar.component';


@NgModule({
  declarations: [
    PasswordchangeComponent,
    LoginComponent,
    WarddashboardComponent,
    WardCustomersidebarComponent
  ],
  imports: [
    CommonModule,
    WardexecutiveRoutingModule
  ]
})
export class WardexecutiveModule { }
