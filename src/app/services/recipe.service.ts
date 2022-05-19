import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private storage:StorageService) { }

  // Observable whose value is: {recipes: [], recipe_date_mapping: []}

  recipe_observable:m_Observable = new m_Observable();

  /** Subscribes an observer to recipe_observable.
   * @param observer The observer to subcribe.
   * @returns nothing
   */
  subscribe(observer:m_Observer) {
    this.recipe_observable.subscribe(observer);
    this.recipe_observable.update(this.recipe_observable.data);
  }

  /** Run in app.component.ts on app start. Assigns initial value to recipe_obsevable.
   * 
   */
  initialise() {
    this.getRecipes().then((val) => {
      this.recipe_observable.update({recipes: val, recipe_date_mappings: {}});
    })
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
    this.recipe_observable.update(recipes);
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
            "unit": "unit",
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
            "unit": "unit",
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
            "unit": "unit",
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
            "unit": "unit",
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
  
  // Used in planner/statistics to tell whether a recipe is already assigned to a PlannerDate.
  already_assigned:boolean = false;

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

  // Observe recipes_observable to stay updated on list of recipes as well as their date-assignments.

  //  recipes_observer.data = {
  //    recipes: [],
  //    recipe_date_mappings: {
  //      "Burger": planner_dates[x],
  //      "Bolognese": planner_dates[y],
  //      "Ravioli": planner_dates[z] 
  //    }
  //  }

  recipes_observer:m_Observer = new m_Observer();

  // An array of Recipe objects.
  recipes:Array<Recipe> = this.recipes_observer.data;

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

export class m_Observable {

  data:any;
  
  observers:Array<m_Observer> = [];

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
      observer.update(this.data);
    }
  }
}

export class m_Observer {
  
  data:any;

  update(new_value:any) {
    this.data = new_value;
  }
}