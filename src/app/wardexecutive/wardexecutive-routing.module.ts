import { WardSidebarComponent } from './ward-sidebar/ward-sidebar.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarddashboardComponent } from './warddashboard/warddashboard.component';
import { authGuard } from '../guards/auth.guard';

const routes: Routes = [
   {
      path: 'executive',
      component: WardSidebarComponent,
      canActivate: [authGuard],
      children: [
        { path: 'ward-dashboard', component: WarddashboardComponent },
        { path: '', redirectTo: 'ward-dashboard', pathMatch: 'full' }
      ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WardexecutiveRoutingModule { }
