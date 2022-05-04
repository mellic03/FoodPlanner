import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionComponent } from './version/version.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [VersionComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    VersionComponent
  ]
})
export class SharedModule { }
