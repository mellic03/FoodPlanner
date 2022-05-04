import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlannerModalPage } from './planner-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PlannerModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlannerModalPageRoutingModule {}
