import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { RecipeModalPageModule } from './recipe-modal/recipe-modal.module';
import { PlannerModalPageModule } from './planner-modal/planner-modal.module';
import { LoginmodalPageModule } from './loginmodal/loginmodal.module';
import { DatemodalPageModule } from './datemodal/datemodal.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    RecipeModalPageModule,
    LoginmodalPageModule,
    PlannerModalPageModule,
    DatemodalPageModule,
    IonicStorageModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule {}
