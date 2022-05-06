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
  // TODO: sum quantities of like-units of measurement.
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

  // Returns an array of all recipe names.
  public getRecipeNames(recipe_object_array:Array<Object>) {
    let recipe_names:Array<string> = [];

    for (let recipe of recipe_object_array) {
      recipe_names.push(recipe["name"]);
    }

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


  // Populates recipes object. Exists for testing purposes.
  public populateData() {
    this.storage.set("persistent_recipes", [
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
    ]);
    console.log("Populated")
  }
  

}