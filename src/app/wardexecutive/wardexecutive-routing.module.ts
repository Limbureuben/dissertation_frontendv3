import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarddashboardComponent } from './warddashboard/warddashboard.component';

const routes: Routes = [
  { path: 'ward-dashboard', component: WarddashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WardexecutiveRoutingModule { }
