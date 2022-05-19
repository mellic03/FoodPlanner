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
    for (let i = 0; i < shopping_list.length-1; i++) {
      for (let j = 0; j < shopping_list.length-1; j++) {
        if (shopping_list[j].name > shopping_list[j+1].name) {
          let temp_ingredient = shopping_list[j];
          shopping_list[j] = shopping_list[j+1];
          shopping_list[j+1] = temp_ingredient;
        }
      }
    }
  }

  /** Returns a shopping list sorted by checked order
   * @param shopping_list Array<Ingredient>
   * @returns Array<Ingredient>
   */
  public sortByChecked(shopping_list:Array<Ingredient>) {
    for (let i = 0; i < shopping_list.length-1; i++) {
      for (let j = 0; j < shopping_list.length-1; j++) {
        if (shopping_list[j].checked == true && shopping_list[j+1].checked == false) {
          let temp_ingredient = shopping_list[j+1]
          shopping_list[j+1] = shopping_list[j]
          shopping_list[j] = temp_ingredient;
        }
      }
    }
  }

  /** Returns an array of ingredients sorted in 1. Alphabetal order and 2. "checked" order.
   * @returns Array<Ingredient>
   */
  public generateShoppingList(ingredients:Array<Ingredient>) {
    let temp_array = ingredients
    this.sortAlphabetically(temp_array)
    this.sortByChecked(temp_array);
    return (temp_array);
  }

  /** Returns an array of all Ingredients from all Recipes.
   * @returns Array<Ingredient>
   */
  public getAllIngredients(recipes:Array<Recipe>) {
    
    let temp_array:Array<Ingredient> = [];

    for (let recipe of recipes) {
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
   * @param new_value The new value of "checked"
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

  /** Updates the recipe array in storage.
   * 
   * @param recipes Array<Recipe>
   * @returns nothing
   */
  public setRecipes(recipes:Array<Recipe>) {
    this.storage.set("all_recipes", recipes);
  }

  /** Retrieves the array of all stored recipes from storage
   * 
   * @returns Array<Recipe>
   */
  public async getRecipes() {
    return(await this.storage.get("all_recipes"));
  }


  // PLANNER-RELATED FUNCTIONS //
  
  public async getPlannerDates() {
    return (this.storage.get("planner_dates"));
  }
  public setPlannerDates(planner_dates:Array<PlannerDate>) {
    this.storage.set("planner_dates", planner_dates);
  }

  public async getPlannerEndDate() {
    return (this.storage.get("planner_end_date"));
  }
  public setPlannerEndDate(end_date:string) {
    this.storage.set("planner_end_date", end_date);
  }

  public async getPlannerStartDate() {
    return (await this.storage.get("planner_start_date"));
  }
  public setPlannerStartDate(start_date:Date) {
    this.storage.set("planner_start_date", start_date);
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