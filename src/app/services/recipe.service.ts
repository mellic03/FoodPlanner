import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private storage:StorageService) { }

  /** Returns a shopping list sorted in alphabetical order
   * 
   * @param shopping_list 
   * @returns Array<Ingredient>
   */
  public sortAlphabetically(shopping_list:Array<Ingredient>) {
    let temp_array:Array<Ingredient> = shopping_list;
    for (let i = 0; i < temp_array.length-1; i++) {
      for (let j = 0; j < temp_array.length-1; j++) {
        if (temp_array[j].name > temp_array[j+1].name) {
          let temp_ingredient = temp_array[j];
          temp_array[j] = temp_array[j+1];
          temp_array[j+1] = temp_ingredient;
        }
      }
    }
    return (temp_array);
  }

  /** Returns a shopping list sorted by checked order
   * @param shopping_list Array<Ingredient>
   * @returns Array<Ingredient>
   */
  public sortByChecked(shopping_list:Array<Ingredient>) {
    let temp_array:Array<Ingredient> = shopping_list;
    for (let i = 0; i < temp_array.length-1; i++) {
      for (let j = 0; j < temp_array.length-1; j++) {
        if (temp_array[j].checked == true && temp_array[j+1].checked == false) {
          let temp_ingredient = temp_array[j+1]
          temp_array[j+1] = temp_array[j]
          temp_array[j] = temp_ingredient;
        }
      }
    }
    return (temp_array);
  }

  /** Returns a list sorted both by alphabetical and checked order with alphabetical order taking priority.
   * @param shopping_list Array<Ingredient>
   * @returns Array<Ingredient>
   */
  public sortByCheckedAndAlphabetically(shopping_list:Array<Ingredient>) {
    let temp_array:Array<Ingredient> = shopping_list;
    temp_array = this.sortByChecked(this.sortAlphabetically(temp_array));
    return (temp_array);
  }

  /** Returns an array of ingredients sorted in 1. Alphabetal order and 2. "checked" order.
   * @returns Array<Ingredient>
   */
  public async generateShoppingList() {

    let ingredients:Array<Ingredient> = await this.getAllIngredients();
    // Sort shopping list alphabetically
    ingredients = this.sortByCheckedAndAlphabetically(ingredients);
    // Sort shopping list by checked.
    return (ingredients);
  }

  /** Returns an array of all Ingredients from all Recipes.
   * @returns Array<Ingredient>
   */
   public async getAllIngredients() {
    
    let all_recipes:Array<Recipe> = await this.storage.get("all_recipes");
    let temp_array:Array<Ingredient> = [];

    for (let recipe of all_recipes) {
      for (let ingredient of recipe.ingredients) {
        temp_array.push(ingredient);
      }
    }

    // Sums the quantities of ingredients with the same name and unit of measurement,
    // then removes the duplicate ingredient.
    for (let i = 0; i < temp_array.length; i++) {
      for (let j = 0; j < temp_array.length; j++) {
        for (let k = 0; k < temp_array.length; k++) {
          if (i != j && temp_array[i].name == temp_array[j].name && temp_array[i].unit == temp_array[j].unit) {
            temp_array[i].quantity += temp_array[j].quantity;
            temp_array.splice(j, 1);

            // If an item is removed at index j, j does not increase for one iteration
            // or the program would skip an element.
            j = j - 1;
          }
        }
      }
    }

    return (temp_array);
  }

  /** Marks an ingredient as "checked". Used for marking ingredients off of the shopping list.
   * @param ingredient_name Ingredient name
   * @param newValue The new value of "checked"
   * @returns nothing
   */
   public async checkIngredient(ingredient_name:string, new_value:boolean) {

    let all_recipes:Array<Recipe> = await this.storage.get("all_recipes");

    for (let recipe of all_recipes) {
      for (let ingredient of recipe.ingredients) {
        if (ingredient.name == ingredient_name) {
          ingredient.checked = new_value;
        }
      }
    }
    this.storage.set("all_recipes", all_recipes);
  }

}


export class Ingredient {
    
  name:string;
  quantity:number;
  unit:string;

  // Used in shopping list to tell whether an ingredient is "checked" off the list.
  checked:boolean = false;

  constructor(name:string, quantity:number, unit:string) {
    this.name = name;
    this.quantity = quantity;
    this.unit = unit;
  }
}

export class Recipe {

  name:string;
  ingredients:Array<Ingredient>;

  // Used in planner/statistics to tell whether a recipe has been cooked.
  cooked:boolean = false;

  constructor(name:string, ingredients:Array<Ingredient> = []) {
    this.name = name;
    this.ingredients = ingredients;
  }

  addIngredient(ingredient:Ingredient) {
    this.ingredients.push(ingredient);
  }
}

export class PlannerDate {

  date_ISO:Date;

  day_of_week_alphabetical:string;
  day_of_week:number;
  day_of_month:number;
  month:number;
  year:number;

  // An array of recipe name-checked pairs
  recipes:Array<Recipe>;

  constructor(date_ISO) {
    this.date_ISO = date_ISO;
    this.day_of_week = this.date_ISO.getDay();

    let week_days:Array<string> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.day_of_week_alphabetical = week_days[this.day_of_week];

    this.day_of_month = this.date_ISO.getDate();
    this.month = this.date_ISO.getMonth();
    this.year = this.date_ISO.getFullYear();

    this.recipes = [];
  }

  // Add a recipe to the recipe array
  addRecipe(recipe:Recipe) {
    this.recipes.push(recipe);
  }

  // Remove a recipe to the recipe array
  removeRecipe(recipe_name:string) {
    for (let i = 0; i < this.recipes.length; i++) {
        if (this.recipes[i].name == recipe_name) {
            this.recipes.splice(i, 1);
            console.log("Removed: " + recipe_name);
            return(0);
        }
    }
    console.log("Could not find recipe: " + recipe_name);
  }
}