import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {

  constructor(private storage:StorageService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    // loads the stored recipes
    this.storage.get("recipes").then( val => {
      this.persistentRecipes = val;
      let ingredient_names = this.getIngredients(this.persistentRecipes);
      let ingredientQuantities = this.getQuantities(this.persistentRecipes);
      this.shopping_list = this.addIngredientQuantities(ingredient_names, ingredientQuantities);
    });
  }

  // returns an array of all recipe names from the json db
  getIngredients(source_json) {
    let temp_array = []; // create temporary array
    for (let i = 0; i < source_json.length; i++) {
      for (let j = 0; j < source_json[i]["ingredients"].length; j++) {
        if (source_json[i]["ingredients"][j]?.["name"]) {
          temp_array.push(source_json[i]["ingredients"][j]["name"]);
        }
      }
    }
    return(temp_array);
  }

  // returns an array of total quantities of each ingredient
  getQuantities(source_json) {
    let temp_array = []; // create temporary array
    for (let i = 0; i < source_json.length; i++) {
      for (let j = 0; j < source_json[i]["ingredients"].length; j++) {
        if (source_json[i]["ingredients"][j]?.["quantity"]) {
          temp_array.push(source_json[i]["ingredients"][j]["quantity"]);
        }
      }
    }
    return(temp_array);
  }

  // takes the input from getIngredients and getQuantities and returns an array of ingredient-quantitiy pairs,
  // accounting for multiple listings of ingredients.
  addIngredientQuantities(name_array, quantity_array) {
    let n_array = name_array;
    let q_array = quantity_array;
    let temp_array = [[]];

    for (let i = 0; i < n_array.length; i++) {
      for (let j = 0; j < n_array.length; j++) {

        if (i != j && n_array[i] == n_array[j]) {
           
          temp_array[i] = [ n_array[i], q_array[i] + q_array[j] ];
          n_array.splice(j, 1);
          q_array.splice(j, 1);  
          // have to use break, the else block is being executed even if the first condition is met,
          // I think it's because I am removing array elements while iterating through it.
          break; 
        }

        else {
          temp_array[i] = [n_array[i], q_array[i]];
        }

      }
    }
    return(temp_array);
  }

  persistentRecipes:any;

  shopping_list:any;
}
