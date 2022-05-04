import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

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

  public set(key:string, value:any) {
    this._storage?.set(key, value);
  }

  public async get(key:string) {
    return(this.storage.get(key));
  }


  
  /* RECIPE-SPECIFIC FUNCTIONS */

  // Returns an array of ingredient names.
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



  /* ALL RECPIES */

  // Returns an array of all ingredients in a recipe in the form of [[name, quantity, unit]].
  public getAllInfo(all_recipes:Array<Object>) {

    let combined_array = [];

    // Populates combined_array with [name, quantity, unit, checked] arrays.
    // Does not remove duplicates or sum ingredient quantities.
    for (let i = 0; i < all_recipes.length; i++) {
      for (let j = 0; j < all_recipes[i]["ingredients"].length; j++) {
        if (all_recipes[i]["ingredients"][j]?.["name"] && all_recipes[i]["ingredients"][j]?.["quantity"]) {
          combined_array.push([
            all_recipes[i]["ingredients"][j]["name"],
            all_recipes[i]["ingredients"][j]["quantity"],
            all_recipes[i]["ingredients"][j]["unit"],
            all_recipes[i]["ingredients"][j]["checked"]
          ]);
        }
      }
    }
    
    // Sums the quantities of ingredients with the same name and unit of measurement,
    // then removes the duplicate ingredient.
    for (let i = 0; i < combined_array.length; i++) {
      for (let j = 0; j < combined_array.length; j++) {
        if (i != j && combined_array[i][0] == combined_array[j][0]) {
          combined_array[i][1] += combined_array[j][1];
          combined_array.splice(j, 1);

          // If an item is removed at index j, j does not increase for one iteration.
          // Otherwise, the program will skip an element.
          j = j - 1;
        }
      }
    }

    return(combined_array);
  }

  // Returns an array of all recipe names
  public getRecipeNames() {
    let recipe_names:Array<string> = [];

    this.storage.get("persistent_recipes").then((val) => {
      let all_recipes = val
      for (let recipe of all_recipes) {
        recipe_names.push(recipe.name);
      }
    });

    return(recipe_names);
  }

  // Returns an array of recipes that contain a given ingredient.
  public getRecipesUsingIngredient(ingredient_name:string) {

  }


  
  /* INGREDIENT-SPECIFIC FUNCTIONS */

  // Marks an ingredient as "checked", used for shopping list.
  public checkIngredient(ingredient_name:string, newValue:boolean) {

    let persistent_recipes;

    this.storage.get("persistent_recipes").then( val => {

      persistent_recipes = val;

      for (let i = 0; i < persistent_recipes.length; i++) {
        for (let j = 0; j < persistent_recipes[i]["ingredients"].length; j++) {
          if (persistent_recipes[i]["ingredients"][j]?.["name"] == ingredient_name) {
            persistent_recipes[i]["ingredients"][j]["checked"] = newValue;
          }
        }
      }
  
      this.storage.set("persistent_recipes", persistent_recipes);
    });
  }

 

  /* OTHER FUNCTIONS */
  public logRecipes() {
    console.log(this.storage.get("persistent_recipes"))
  }

}