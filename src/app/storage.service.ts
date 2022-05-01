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

  // Returns an array of all ingredients in the form of [[name, quantity, unit]].
  public getNamesQuantitiesUnits(all_recipes:Array<Object>) {

    let combined_array = [];

    // Populates combined_array with [name, quantity, unit] arrays.
    // Does not remove duplicates or sum ingredient quantities.
    for (let i = 0; i < all_recipes.length; i++) {
      for (let j = 0; j < all_recipes[i]["ingredients"].length; j++) {
        if (all_recipes[i]["ingredients"][j]?.["name"] && all_recipes[i]["ingredients"][j]?.["quantity"]) {
          combined_array.push([all_recipes[i]["ingredients"][j]["name"], all_recipes[i]["ingredients"][j]["quantity"], all_recipes[i]["ingredients"][j]["unit"]]);
        }
      }
    }
    
    // Sums the quantities of ingredients with the same name and unit of measurement.
    // Removes the spare ingredient after summation and replaces it with []
    // so as to not change the array length while iterating.
    for (let i = 0; i < combined_array.length; i++) {
      for (let j = 0; j < combined_array.length; j++) {
        if (i != j && combined_array[i][0] == combined_array[j][0]) {
          combined_array[i][1] += combined_array[j][1];
          combined_array[j] = [];
        }
      }
    }

    // Removes all [].
    for (let i = 0; i < combined_array.length; i++) {
      if (!combined_array[i][0]) {
        combined_array.splice(i, 1);
      }
    }

    return(combined_array);
  }
}