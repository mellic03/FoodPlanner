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

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key:string, value:any) {
    this._storage?.set(key, value);
  }

  public get(key:string) {
    return(this.storage.get(key));
  }

  // Returns an array with summed ingredient quantities and with duplicate ingredients removed.
  public getNamesQuantities(source_json) {

    // Populates combined_array with ingredient name-quantity pair arrays.
    // Does not remove duplicates or sum ingredient quantities.
    let combined_array = [];
    for (let i = 0; i < source_json.length; i++) {
      for (let j = 0; j < source_json[i]["ingredients"].length; j++) {
        if (source_json[i]["ingredients"][j]?.["name"] && source_json[i]["ingredients"][j]?.["quantity"]) {
          combined_array.push( [ source_json[i]["ingredients"][j]["name"], source_json[i]["ingredients"][j]["quantity"] ] );
        }
      }
    }
    
    // iterate through combined_array
    // 1. For each ingredient i, check all index positions except for i for another ingredient with the same name.
    // 2. If this is found, += quantity of other ingredient.
    // 3. Replace the found ingredient with [].
    for (let i = 0; i < combined_array.length; i++) {
      for (let j = 0; j < combined_array.length; j++) {
        if (i != j && combined_array[i][0] == combined_array[j][0]) {
          combined_array[i][1] += combined_array[j][1];
          combined_array[j] = [];
        }
      }
    }

    // 4. Iterate over array again and remove all [].
    for (let i = 0; i < combined_array.length; i++) {
      if (!combined_array[i][0]) {
        combined_array.splice(i, 1);
      }
    }

    return(combined_array);
  }
}