import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatemodalPage } from './datemodal.page';

const routes: Routes = [
  {
    path: '',
    component: DatemodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatemodalPageRoutingModule {}
