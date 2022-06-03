import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BounceInComponent } from './bounce-in/bounce-in.component';
import { NothingHereComponent } from './nothing-here/nothing-here.component';

@NgModule({
  declarations: [BounceInComponent, NothingHereComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [BounceInComponent, NothingHereComponent]
})
export class SharedModule { }
