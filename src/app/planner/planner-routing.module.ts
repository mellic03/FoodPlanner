import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlannerPage } from './planner.page';

const routes: Routes = [
  {
    path: '',
    component: PlannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlannerPageRoutingModule {}
