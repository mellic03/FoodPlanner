import { Component, OnInit } from '@angular/core';
import { RecipeModalPage } from '../recipe-modal/recipe-modal.page';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
  providers: [StorageService]
})
export class RecipesPage implements OnInit {

  constructor(private modalController:ModalController, platform:Platform, private storage:StorageService) {}

  ngOnInit() {
    // load the stored recipes
    this.storage.get("persistent_recipes").then( val => {
      this.persistent_recipes = val;
    });
  }

  ngOnDestroy() {
    // Update persistent storage with the local array.
    this.storage.set("persistent_recipes", this.persistent_recipes);
  }

  // Presents the add/edit recipe modal. If editing the index i of a recipe is passed and editing is set to true.
  async presentModal(i:number = 0, editing:boolean = false) {
    const modal = await this.modalController.create({
      component: RecipeModalPage,
      // Passes the recipe object at index i, the index i and the editing boolean.
      componentProps: {recipe: this.persistent_recipes[i], index: i, editing: editing}
    });

    modal.onDidDismiss().then(() => {
      this.storage.get("persistent_recipes").then( val => {
        this.persistent_recipes = val;
      });
    });
    
    return (modal.present());
  }

  // Remove a recipe from the recipe list.
  deleteRecipe(i:number) {
    // Remove the recipe from the local array
    this.persistent_recipes.splice(i, 1);
    // Replace the persistent object.
    this.storage.set("persistent_recipes", this.persistent_recipes);
  }

  persistent_recipes:Array<any>; // recipes the user has not marked as "cooked".
}
