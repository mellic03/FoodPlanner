import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FadeInComponent } from './fade-in/fade-in.component';

@NgModule({
  declarations: [FadeInComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [FadeInComponent]
})
export class SharedModule { }
