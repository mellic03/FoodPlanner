import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngredientModalPage } from './ingredient-modal.page';

const routes: Routes = [
  {
    path: '',
    component: IngredientModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngredientModalPageRoutingModule {}
