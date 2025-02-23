import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './sharing/header/header.component';
import { FooterComponent } from './sharing/footer/footer.component';
import { OnlineComponent } from './sharing/online/online.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
