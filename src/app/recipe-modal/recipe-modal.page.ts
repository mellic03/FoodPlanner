import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Ingredient, Recipe } from '../services/recipe.service';
import { StorageService } from '../services/storage.service';
import { RecipeService, m_Observer } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.page.html',
  styleUrls: ['./recipe-modal.page.scss'],
  providers: [StorageService]
})

export class RecipeModalPage implements OnInit {

  constructor(
    private navParams:NavParams,
    private modalController:ModalController,
    private recipeService:RecipeService) {

  }

  async ngOnInit() {

    await this.recipeService.subscribe(this.all_recipes_observer);
    this.all_recipes = this.all_recipes_observer.data;

    let editing = this.navParams.get("editing");

    if (editing) {
      // Get index of recipe in all_recipes.
      this.index = this.navParams.get("index");

      // Fill recipe name.
      let current_recipe = await this.navParams.get("recipe");
      this.recipe_name = current_recipe.name;
      
      // Populate ingredient name/quantity/unit arrays with existing ingredients.
      for (let i = 0; i < current_recipe.ingredients.length; i++) {
        this.ingredient_names[i+1] = current_recipe.ingredients[i].name;
        this.ingredient_quantities[i+1] = current_recipe.ingredients[i].quantity;
        this.ingredient_units[i+1] = current_recipe.ingredients[i].unit;
      }
    }
  }

  // Dismisses the modal page.
  closeModal() {
    this.modalController.dismiss();
  }

  // Combines the information in the current_recipe array and adds it to all_recipes.
  // Then replaces all_recipes in ionic storage with the local all_recipes.
  createRecipe(recipe_name) {

    // Don't continue if the user has not entered a recipe name.
    if (recipe_name == undefined || recipe_name == "") {
      return (0);
    }

    let temp_recipe:Recipe = new Recipe(recipe_name);

    // Create ingredient objects from names, quantities and units arrays, then add them to the recipe object.
    // Index starts at 1 as index 0 holds an empty value in all arrays.
    for (let i = 1; i < this.ingredient_names.length; i++) {
      
      // If the ingredient has a name, continue. Otherwise, do nothing.
      if (this.ingredient_names[i]) {

        let name:string = this.ingredient_names[i];
        let quantity:number = this.ingredient_quantities[i];
        let unit:string;
        
        if (this.ingredient_units[i] == null) {
          unit = "unit";
        }
        else {
          unit = this.ingredient_units[i];
        }
  
        let new_ingredient:Ingredient = new Ingredient(name, quantity, unit);
        temp_recipe.ingredients.push(new_ingredient); // obj.function() does not work if obj is passed through NavParams.
      }
    }
  
    if (this.editing) {
      this.all_recipes[this.index] = temp_recipe;
    }
    else {
      this.all_recipes.push(temp_recipe);
    }
    
    this.recipeService.setRecipes(this.all_recipes);

    this.modalController.dismiss();
  }

  // Remove an ingredient from a recipe
  removeIngredient(index:number, sliding_item) {
    this.ingredient_names.splice(index, 1);
    this.ingredient_quantities.splice(index, 1);
    this.ingredient_units.splice(index, 1);
    sliding_item.close();
  }

  all_recipes_observer:m_Observer = new m_Observer();
  all_recipes:Array<Recipe> = [];
  recipe_name:string;
  ingredient_names:Array<string> = [null];
  ingredient_quantities:Array<number> = [null];
  ingredient_units:Array<string> = [null];

  // All valid units of measurement used by the app.
  units:Array<string> = ["gram", "kilogram", "millilitre", "litre", "cup", "jar", "teaspoon", "tablespoon", "unit", "no unit"];

  // Used to perform different actions depending on whether a new
  // recipe is being created or an existing one is being edited.
  editing:boolean = false;
  index:number;

}
