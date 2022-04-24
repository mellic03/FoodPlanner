import { Component, OnInit } from '@angular/core';
import { RecipeModalPage } from '../recipe-modal/recipe-modal.page';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { StorageService } from '../storage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
  providers: [StorageService]
})
export class RecipesPage implements OnInit {

  constructor(private modalController:ModalController, platform:Platform, private storage:StorageService) {}

  ngOnInit() {}

  async presentModal() {
  
    const modal = await this.modalController.create({
      component: RecipeModalPage,
    });

    modal.onDidDismiss().then(() => {
      this.storage.get("recipes_uncooked").then( val => {
        this.recipes_uncooked = val;
      });
    });
    
    return (modal.present());
  }

  ionViewDidEnter() {
    // load the stored recipes
    this.storage.get("recipes_uncooked").then( val => {
      this.recipes_uncooked = val;
    });
    this.storage.get("recipes_cooked").then( val => {
      this.recipes_cooked = val;
    });

  }

  // Set recipes in storage to recipes on current page, then load the stored recipes.
  refreshStorage() {
    this.storage.set("recipes_uncooked", this.recipes_uncooked);
    this.storage.set("recipes_cooked", this.recipes_cooked);
    this.storage.get("recipes_uncooked").then( val => {this.recipes_uncooked = val;});
    this.storage.get("recipes_cooked").then( val => {this.recipes_cooked = val;});
  }

  markRecipeAsCooked(index:number) {
    this.recipes_cooked.push(this.recipes_uncooked[index]); // Add recipe to recipes_cooked.
    this.recipes_uncooked.splice(index, 1); // Remove recipe from recipes_uncooked.
    this.refreshStorage(); // Refresh storage
  }

  markRecipeAsUncooked(index:number) {
    this.recipes_uncooked.push(this.recipes_cooked[index]); // Add recipe to recipes_uncooked.
    this.recipes_cooked.splice(index, 1); // Remove recipe from recipes_cooked.
    this.refreshStorage(); // Refresh storage.
  }
  
  recipes_uncooked:Array<any>; // recipes the user has not marked as "cooked".
  recipes_cooked:Array<any>; // recipes the user has marked as "cooked".
}
