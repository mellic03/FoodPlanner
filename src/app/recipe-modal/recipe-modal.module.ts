import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeModalPageRoutingModule } from './recipe-modal-routing.module';

import { RecipeModalPage } from './recipe-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeModalPageRoutingModule
  ],
  declarations: [RecipeModalPage]
})
export class RecipeModalPageModule {}
