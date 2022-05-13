import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatemodalPageRoutingModule } from './datemodal-routing.module';

import { DatemodalPage } from './datemodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatemodalPageRoutingModule
  ],
  declarations: [DatemodalPage]
})
export class DatemodalPageModule {}
