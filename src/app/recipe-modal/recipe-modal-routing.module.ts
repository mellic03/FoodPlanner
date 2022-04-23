import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeModalPage } from './recipe-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RecipeModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipeModalPageRoutingModule {}
