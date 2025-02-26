import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './sharing/header/header.component';
import { FooterComponent } from './sharing/footer/footer.component';
import { OnlineComponent } from './sharing/online/online.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminSidebarComponent } from './admin/admin-sidebar/admin-sidebar.component';
import { UserHeaderComponent } from './user/user-header/user-header.component';

const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full'},
  {
    path: 'app',
    component: HeaderComponent,
    loadChildren:() =>
      import('./sharing/sharing.module').then((m) => m.SharingModule),
  },
  {
    path: 'app',
    component: FooterComponent,
    loadChildren: () =>
      import('./sharing/sharing.module').then((m)=>m.SharingModule)
  },
  {
    path: 'app',
    component: OnlineComponent,
    loadChildren: () =>
      import('./sharing/sharing.module').then((m)=>m.SharingModule)
  },
  {
    path: 'app',
    component: AdminHeaderComponent,
    loadChildren: () =>
      import('./admin/admin.module').then((m) =>m.AdminModule)
  },
  {
    path: 'app',
    component: AdminSidebarComponent,
    loadChildren: () =>
      import('./admin/admin.module').then((m) =>m.AdminModule)
  },
  {
    path: 'app',
    component: UserHeaderComponent,
    loadChildren: () =>
      import('./user/user.module').then((m) =>m.UserModule)
  },
  {
    path: 'app',
    component: UserHeaderComponent,
    loadChildren: () =>
      import('./user/user.module').then((m) =>m.UserModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
