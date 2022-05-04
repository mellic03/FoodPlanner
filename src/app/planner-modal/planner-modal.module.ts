import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlannerModalPageRoutingModule } from './planner-modal-routing.module';

import { PlannerModalPage } from './planner-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlannerModalPageRoutingModule
  ],
  declarations: [PlannerModalPage]
})
export class PlannerModalPageModule {}
