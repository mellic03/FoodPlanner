import { Component, OnInit } from '@angular/core';
import { RecipeModalPage } from '../recipe-modal/recipe-modal.page';
import { ModalController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { RecipeService, Recipe, Ingredient, m_Observer } from '../services/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
  providers: [StorageService]
})
export class RecipesPage implements OnInit {

  constructor(private modalController:ModalController, private recipeService:RecipeService) {}

  async ngOnInit() {
    // Subscribe to all_recipes observable
    this.recipeService.subscribe(this.all_recipes_observer);
    this.all_recipes = this.all_recipes_observer.data.recipes;
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
        this.recipeService.setRecipes(this.all_recipes);
      }
    });
    return (modal.present());
  }

  // Remove a recipe from the recipe list.
  deleteRecipe(i:number) {
    // Remove the recipe from the local array
    this.all_recipes.splice(i, 1);
    // Replace the persistent object.
    this.recipeService.setRecipes(this.all_recipes);
  }

  all_recipes_observer:m_Observer = new m_Observer();

  all_recipes:Array<Recipe>; // Array of all recipe objects.
}
