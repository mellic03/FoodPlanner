import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IngredientModalPageRoutingModule } from './ingredient-modal-routing.module';

import { IngredientModalPage } from './ingredient-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngredientModalPageRoutingModule
  ],
  declarations: [IngredientModalPage]
})
export class IngredientModalPageModule {}
