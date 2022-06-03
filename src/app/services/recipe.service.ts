import { Injectable, OnInit } from '@angular/core';
import { StorageService } from './storage.service';
import { PlannerDate } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {


  constructor(private storage:StorageService) {
  }

  // Observable which holds "recipe_array" from ionic storage
  recipe_observable:m_Observable = new m_Observable();

  /** Subscribes an observer to recipe_observable.
   * @param observer The observer to subcribe.
   * @returns nothing
   */
  async subscribe(observer:m_Observer) {
    this.recipe_observable.subscribe(observer);
    this.recipe_observable.update(await this.storage.get("all_recipes"));
  }

  /** Returns a shopping list sorted in alphabetical order
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

  /** Returns an array of all Ingredients from all Recipes with duplicates removed and quantity summed.
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

  /** Returns an array of all Ingredients from all Recipes without duplicates removed or quantity summed.
   * @returns Array<Ingredient>
   */
  public getAllIngredientsWithDuplicates(recipes:Array<Recipe>) {
    let temp_array:Array<Ingredient> = [];

    for (let recipe of recipes) {
      for (let ingredient of recipe.ingredients) {
        temp_array.push(ingredient);
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
    this.setRecipes(all_recipes);
  }

  /** Updates the recipe array in storage and the value of this.recipe_observable.
   * 
   * @param recipes Array<Recipe>
   * @returns nothing
   */
  public setRecipes(recipes:Array<Recipe>) {
    this.recipe_observable.update(recipes);
    this.storage.set("all_recipes", recipes);
  }

  /** Retrieves the array of all stored recipes from storage
   * 
   * @returns Array<Recipe>
   */
  public async getRecipes() {
    return (this.storage.get("all_recipes"));
  }

  // Populates recipes object. Exists for testing purposes.
  public async populateData() {
    let recipes = [
      {
        "name": "Bolognese",
        "ingredients": [
          {
            "name": "mince",
            "quantity": 250,
            "unit": "gram",
            "checked": false
          },
          {
            "name": "pasta",
            "quantity": 100,
            "unit": "gram",
            "checked": false
          },
          {
            "name": "pasta sauce",
            "quantity": 1,
            "unit": "jar",
            "checked": false
          }
        ]
      },
      {
        "name": "Burgers",
        "ingredients": [
          {
            "name": "mince",
            "quantity": 500,
            "unit": "gram",
            "checked": false
          },
          {
            "name": "buns",
            "quantity": 4,
            "unit": "no unit",
            "checked": false
          },
          {
            "name": "cheese",
            "quantity": 1,
            "unit": "cup",
            "checked": false
          }
        ]
      },
      {
        "name": "Alfredo",
        "ingredients": [
          {
            "name": "fettuccine",
            "quantity": 200,
            "unit": "gram",
            "checked": false
          },
          {
            "name": "cream",
            "quantity": 1,
            "unit": "cup",
            "checked": false
          },
          {
            "name": "garlic",
            "quantity": 4,
            "unit": "no unit",
            "checked": false
          },
          {
            "name": "parsley",
            "quantity": 1,
            "unit": "unit",
            "checked": false
          }
        ]
      },
      {
        "name": "Pizza",
        "ingredients": [
          {
            "name": "flour",
            "quantity": 2,
            "unit": "cup",
            "checked": false
          },
          {
            "name": "passata",
            "quantity": 1,
            "unit": "jar",
            "checked": false
          },
          {
            "name": "cheese",
            "quantity": 1,
            "unit": "cup",
            "checked": false
          },
          {
            "name": "pepperoni",
            "quantity": 1,
            "unit": "unit",
            "checked": false
          }
        ]
      },
      {
        "name": "Daal",
        "ingredients": [
          {
            "name": "red lentils",
            "quantity": 2,
            "unit": "cup",
            "checked": false
          },
          {
            "name": "spices",
            "quantity": 50,
            "unit": "gram",
            "checked": false
          },
          {
            "name": "rice",
            "quantity": 2,
            "unit": "cup",
            "checked": false
          },
          {
            "name": "coconut milk",
            "quantity": 1,
            "unit": "cup",
            "checked": false
          }
        ]
      },
      {
        "name": "Chicken Schitzel",
        "ingredients": [
          {
            "name": "chicken",
            "quantity": 250,
            "unit": "gram",
            "checked": false
          },
          {
            "name": "breadcrumbs",
            "quantity": 1,
            "unit": "cup",
            "checked": false
          },
          {
            "name": "egg",
            "quantity": 2,
            "unit": "no unit",
            "checked": false
          },
          {
            "name": "flour",
            "quantity": 1,
            "unit": "cup",
            "checked": false
          }
        ]
      },
      {
        "name": "Potato salad",
        "ingredients": [
          {
            "name": "potato",
            "quantity": 4,
            "unit": "no unit",
            "checked": false
          },
          {
            "name": "mayonnaise",
            "quantity": 1,
            "unit": "cup",
            "checked": false
          },
          {
            "name": "vinegar",
            "quantity": 20,
            "unit": "gram",
            "checked": false
          },
          {
            "name": "pepper",
            "quantity": 1,
            "unit": "unit",
            "checked": false
          }
        ]
      }
    ];

    let recipe_array:Array<Recipe> = [];

    for (let recipe of recipes) {
      let recipe_name = recipe.name;
      let new_recipe:Recipe = new Recipe(recipe_name);
      
      for (let ingredient of recipe.ingredients) {
        let ingredient_name = ingredient.name;
        let ingredient_quantity = ingredient.quantity;
        let ingredient_unit = ingredient.unit;
        let new_ingredient:Ingredient = new Ingredient(ingredient_name, ingredient_quantity, ingredient_unit);
        new_recipe.addIngredient(new_ingredient);
      }
      recipe_array.push(new_recipe);
    }
    console.log("populating with:", recipe_array);
    this.setRecipes(recipe_array);
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
  
  // Keeps track of what date the recipe is assigned to.
  date_assigned_to:Date = undefined;

  constructor(name:string, ingredients:Array<Ingredient> = []) {
    this.name = name;
    this.ingredients = ingredients;
  }

  addIngredient(ingredient:Ingredient) {
    this.ingredients.push(ingredient);
  }
}


export class m_Observable {

  data:any;
  observers:Array<m_Observer> = [];

  constructor(data:any = []) {
    this.data = data;
  }

  subscribe(observer:m_Observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer:m_Observer) {
    for (let i = 0; i < this.observers.length; i++) {
      if (this.observers[i] == observer) {
        this.observers.splice(i, 1)
        break;
      }
    }
  }

  update(new_value:any) {
    this.data = new_value;
    for (let observer of this.observers) {
      observer?.update(this.data);
    }
  }
}

export class m_Observer {
  
  data:any;

  update(new_value:any) {
    this.data = new_value;
  }
}