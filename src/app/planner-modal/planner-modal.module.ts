import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PlannerModalPageRoutingModule } from './planner-modal-routing.module';
import { PlannerModalPage } from './planner-modal.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlannerModalPageRoutingModule,
    SharedModule
  ],
  declarations: [PlannerModalPage]
})
export class PlannerModalPageModule {}
