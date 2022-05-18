import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { Ingredient, Recipe } from './recipe.service';

@Injectable({
  providedIn: 'root'
})

export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async set(key:string, value:any) {
    this._storage?.set(key, value);
  }

  public async get(key:string) {
    return(this.storage.get(key));
  }


  
  /* RECIPE-SPECIFIC FUNCTIONS */


  /** Returns an array of ingredient names.
   * @param recipe Recipe object. E.g. {name: "Bolognese", ingredients: [{}, {}, ...]}
   * @returns Array<string>
   */
  public getNames(recipe:Object) {
    let temp_array = [];
    for (let i = 0; i < recipe["ingredients"].length; i++) {
      temp_array[i] = recipe["ingredients"][i]["name"];
    }
    return(temp_array);
  }

  // Returns an array of ingredient quantities.
  public getQuantities(recipe:Object) {
    let temp_array = [];
    for (let i = 0; i < recipe["ingredients"].length; i++) {
      temp_array[i] = recipe["ingredients"][i]["quantity"];
    }
    return(temp_array);
  }

  // Returns an array of ingredient quantities.
  public getUnits(recipe:Object) {
    let temp_array = [];
    for (let i = 0; i < recipe["ingredients"].length; i++) {
      temp_array[i] = recipe["ingredients"][i]["unit"];
    }
    return(temp_array);
  }



  /* RECIPE ARRAYS */

  /** Returns an array of all ingredients in an array of recipe objects in the form [[name, quantity, units, checked], ...]
   * @param recipe_object_array Array of recipe objects
   * @returns Array<Array<string | number | boolean>>
   */
  public getAllInfo(recipe_object_array:Array<Object>) {

    let combined_array = [];

    // Populates combined_array with [name, quantity, unit, checked] arrays.
    // Does not remove duplicates or sum ingredient quantities.
    for (let i = 0; i < recipe_object_array.length; i++) {
      for (let j = 0; j < recipe_object_array[i]["ingredients"].length; j++) {
        if (recipe_object_array[i]["ingredients"][j]?.["name"] && recipe_object_array[i]["ingredients"][j]?.["quantity"]) {
          combined_array.push([
            recipe_object_array[i]["ingredients"][j]["name"],
            recipe_object_array[i]["ingredients"][j]["quantity"],
            recipe_object_array[i]["ingredients"][j]["unit"],
            recipe_object_array[i]["ingredients"][j]["checked"]
          ]);
        }
      }
    }
    
    // Sums the quantities of ingredients with the same name and unit of measurement,
    // then removes the duplicate ingredient.
    for (let i = 0; i < combined_array.length; i++) {
      for (let j = 0; j < combined_array.length; j++) {
        for (let k = 0; k < combined_array.length; k++) {
          if (i != j && combined_array[i][0] == combined_array[j][0] && combined_array[i][2] == combined_array[j][2]) {
            combined_array[i][1] += combined_array[j][1];
            combined_array.splice(j, 1);

            // If an item is removed at index j, j does not increase for one iteration.
            // Otherwise, the program will skip an element.
            j = j - 1;
          }
        }
      }
    }

    return(combined_array);
  }

  /** Returns an array of all recipe names in an array of recipe objects.
   * @param recipe_object_array Array of recipe objects
   * @returns Array<string>
   */
  public getRecipeNames(recipe_object_array:Array<Object>) {
    let recipe_names:Array<string> = [];

    for (let recipe of recipe_object_array) {
      recipe_names.push(recipe["name"]);
    }

    return(recipe_names);
  }

  /** Returns an array of all Ingredient objects in a given Recipe array
   * 
   * @param recipe_array Array of Recipe objects
   * @returns Array<Ingredient>
   */
  public getIngredients(recipe_array:Array<Recipe>) {
    let temp_array:Array<Ingredient> = [];
    for (let recipe of recipe_array) {
      for (let ingredient of recipe.ingredients) {
        temp_array.push(ingredient);
      }
    }
    return(temp_array);
  }

  /* INGREDIENT-SPECIFIC FUNCTIONS */


  /** Returns an array of recipes containing a given ingredient.
   * 
   * @param ingredient_name Ingredient name
   * @param recipe_array Array of Recipe objects
   * @returns Array<Recipe>
   */
  public getRecipesContaining(ingredient_name:string, recipe_array:Array<Recipe>) {
    let temp_array:Array<Recipe>;
    for (let recipe of recipe_array) {
      for (let ingredient of recipe.ingredients) {
        if (ingredient.name == ingredient_name)  {
          temp_array.push(recipe);
        }
      }
    }
    return(temp_array)
  }
 

  /* OTHER FUNCTIONS */
  public logRecipes() {
    console.log(this.storage.get("all_recipes"))
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

    await this.storage.set("all_recipes", recipe_array);
  }
  
  public async clear() {
    this.clear();
  }

}