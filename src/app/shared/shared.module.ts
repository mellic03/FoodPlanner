import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FadeInComponent } from './fade-in/fade-in.component';
import { NoRecipesComponent } from './no-recipes/no-recipes.component';

@NgModule({
  declarations: [FadeInComponent, NoRecipesComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [FadeInComponent, NoRecipesComponent]
})
export class SharedModule { }
