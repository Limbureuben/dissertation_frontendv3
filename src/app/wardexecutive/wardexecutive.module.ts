import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WardexecutiveRoutingModule } from './wardexecutive-routing.module';
import { PasswordchangeComponent } from './passwordchange/passwordchange.component';
import { LoginComponent } from './login/login.component';
import { WarddashboardComponent } from './warddashboard/warddashboard.component';


@NgModule({
  declarations: [
    PasswordchangeComponent,
    LoginComponent,
    WarddashboardComponent
  ],
  imports: [
    CommonModule,
    WardexecutiveRoutingModule
  ]
})
export class WardexecutiveModule { }
