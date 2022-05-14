import { Component, OnInit } from '@angular/core';
import { RecipeModalPage } from '../recipe-modal/recipe-modal.page';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { Ingredient, Recipe } from '../Recipe';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
  providers: [StorageService]
})
export class RecipesPage implements OnInit {

  constructor(private modalController:ModalController, platform:Platform, private storage:StorageService) {}

  async ngOnInit() {
    // load the stored recipes
    this.all_recipes = await this.storage.get("all_recipes");
  }

  ngOnDestroy() {
    // Update persistent storage with the local array.
    this.storage.set("all_recipes", this.all_recipes);
  }

  // Presents the add/edit recipe modal. If editing the index i of a recipe is passed and editing is set to true.
  async presentModal(recipe:Recipe = undefined, editing:boolean = false, index:number = undefined) {
    const modal = await this.modalController.create({
      component: RecipeModalPage,
      // Passes the index of the object being edited.
      componentProps: {recipe: recipe, editing: editing, index: index}
    });

    modal.onDidDismiss().then((data) => {
      // Add returned recipe to recipe array
      if (data.data != undefined) {
        if (data.data.editing) {
          this.all_recipes[data.data.index] = data.data.recipe;
        }
        else {
          this.all_recipes.push(data.data.recipe);
        }
        this.storage.set("all_recipes", this.all_recipes);
      }
    });
    return (modal.present());
  }

  // Remove a recipe from the recipe list.
  deleteRecipe(i:number) {
    // Remove the recipe from the local array
    this.all_recipes.splice(i, 1);
    // Replace the persistent object.
    this.storage.set("all_recipes", this.all_recipes);
  }

  all_recipes:Array<Recipe>; // Array of all recipe objects.
}
