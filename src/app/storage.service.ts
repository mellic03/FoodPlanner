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

  // Returns an array of ingredient names when given a recipe as input.
  public getIngredientNames(recipe) {
    let temp_array = [];
    for (let i = 0; i < recipe["ingredients"].length; i++) {
      temp_array[i] = recipe["ingredients"][i]["name"];
    }
    return(temp_array);
  }

  // Returns an array of ingredient quantities when given a recipe as input.
  public getIngredientQuantities(recipe) {
    let temp_array = [];
    for (let i = 0; i < recipe["ingredients"].length; i++) {
      temp_array[i] = recipe["ingredients"][i]["quantity"];
    }
    return(temp_array);
  }

  // Returns an array of ingredient quantities when given a recipe as input.
  public getIngredientUnits(recipe) {
    let temp_array = [];
    for (let i = 0; i < recipe["ingredients"].length; i++) {
      temp_array[i] = recipe["ingredients"][i]["unit"];
    }
    return(temp_array);
  }

  // Returns an array of ingredient names/quantities/units when given a recipe as input.
  public getNamesQuantitiesUnits(recipe) {

    let combined_array = [];

    // Populates combined_array with ingredient name-quantity pair arrays.
    // Does not remove duplicates or sum ingredient quantities.
    for (let i = 0; i < recipe.length; i++) {
      for (let j = 0; j < recipe[i]["ingredients"].length; j++) {
        if (recipe[i]["ingredients"][j]?.["name"] && recipe[i]["ingredients"][j]?.["quantity"]) {
          combined_array.push([recipe[i]["ingredients"][j]["name"], recipe[i]["ingredients"][j]["quantity"], recipe[i]["ingredients"][j]["unit"]]);
        }
      }
    }
    
    // iterate through combined_array
    // 1. For each ingredient i, check all index positions except for i for another ingredient with the same name.
    // 2. If this is found, += quantity of other ingredient.
    // 3. Replace the found ingredient with []. This is done instead of splicing so as to not change
    // the array length while iterating through it.
    for (let i = 0; i < combined_array.length; i++) {
      for (let j = 0; j < combined_array.length; j++) {
        if (i != j && combined_array[i][0] == combined_array[j][0]) {
          combined_array[i][1] += combined_array[j][1];
          combined_array[j] = [];
        }
      }
    }

    // 4. Iterate over array again to remove all [].
    for (let i = 0; i < combined_array.length; i++) {
      if (!combined_array[i][0]) {
        combined_array.splice(i, 1);
      }
    }

    return(combined_array);
  }


  /* ALL RECPIES */

  // Returns an array of recipe names
  public getRecipeNames(all_recipes_object) {
    let temp_array = [];
    for (let i = 0; i < all_recipes_object.length; i++) {
      temp_array[i] = all_recipes_object[i]["name"]
    }
    return(temp_array);
  }

  // Returns an array of summed ingredient quantities with duplicate ingredients removed.
  public getNamesQuantities(all_recipes_object) {
    
    let combined_array = [];

    // Populates combined_array with ingredient name-quantity pair arrays.
    // Does not remove duplicates or sum ingredient quantities.
    for (let i = 0; i < all_recipes_object.length; i++) {
      for (let j = 0; j < all_recipes_object[i]["ingredients"].length; j++) {
        if (all_recipes_object[i]["ingredients"][j]?.["name"] && all_recipes_object[i]["ingredients"][j]?.["quantity"]) {
          combined_array.push([all_recipes_object[i]["ingredients"][j]["name"], all_recipes_object[i]["ingredients"][j]["quantity"]]);
        }
      }
    }
    
    // iterate through combined_array
    // 1. For each ingredient i, check all index positions except for i for another ingredient with the same name.
    // 2. If this is found, += quantity of other ingredient.
    // 3. Replace the found ingredient with []. This is done instead of splicing so as to not change
    // the array length while iterating through it.
    for (let i = 0; i < combined_array.length; i++) {
      for (let j = 0; j < combined_array.length; j++) {
        if (i != j && combined_array[i][0] == combined_array[j][0]) {
          combined_array[i][1] += combined_array[j][1];
          combined_array[j] = [];
        }
      }
    }

    // 4. Iterate over array again to remove all [].
    for (let i = 0; i < combined_array.length; i++) {
      if (!combined_array[i][0]) {
        combined_array.splice(i, 1);
      }
    }

    return(combined_array);
  }
}