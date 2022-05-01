import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.page.html',
  styleUrls: ['./recipe-modal.page.scss'],
  providers: [StorageService]
})

export class RecipeModalPage implements OnInit {

  constructor(private navParams:NavParams, private modalController:ModalController, platform:Platform, private storage:StorageService) {}

  ngOnInit() {

    // Load all recipes from persistent storage.
    this.storage.get("persistent_recipes").then( val => {this.persistent_recipes = val;});

    // If in editing mode, get relevant recipe information.
    this.editing = this.navParams.get('editing');

    if (this.editing) {

      // Get index.
      this.index = this.navParams.get('index')

      // Get recipe name.
      let recipe_object = this.navParams.get('recipe');
      this.recipe_name = recipe_object.name;

      this.current_recipe.push(this.storage.getNames(recipe_object));
      this.current_recipe[0].unshift("[]");

      this.current_recipe.push(this.storage.getQuantities(recipe_object));
      this.current_recipe[1].unshift("[]");

      this.current_recipe.push(this.storage.getUnits(recipe_object));
      this.current_recipe[2].unshift("[]");

    }
  }

  // adds the unit of measurement for an ingredient to units[], called when a unit of measurement is selected.
  setUnit(unit:string, index:number) {
    this.current_recipe[2][index] = unit;
  }
  
  closeModal() {
    this.modalController.dismiss();
  }

  // combines the data from the ingredient_names, _quantities and _units
  // arrays to create a javascript object which is added to the persistent_recipes object.
  // The persistent_recipes object then replaces "recipes" in ionic storage.
  createRecipe(name:string, ingredients_array:Array<string>, quantities_array:Array<number>, units_array:Array<string>) {

    // If in editing mode, remove the [] in each array placed by the modal.
    if (this.editing) {
      for (let i = 0; i < this.current_recipe[0].length; i++) {
        if (this.current_recipe[0][i] == '[]') {
          this.current_recipe[0].splice(i, 1);
          this.current_recipe[1].splice(i, 1);
          this.current_recipe[2].splice(i, 1);
        }
      }
    }

    // "blank" object, where "recipe" is the recipe name
    let temp_object = {
      "name": "recipe",
      "ingredients": []
    };

    // Set recipe name
    temp_object["name"] = name;

    // iterate from 0 to the number of ingredients
    for (let i = 0; i < ingredients_array.length; i++) {
      // don't do anything if the name is blank
      if (ingredients_array[i] != "") {
        temp_object["ingredients"][i] = {
          name: ingredients_array[i],
          quantity: quantities_array[i],
          unit: units_array[i]
        };
      }
    }

    // If in editing mode, replace the object at the correct index with working_object.
    if (this.editing) {
      this.persistent_recipes[this.index] = temp_object;
    }

    // If not in editing mode, push working_object to persistent storage.
    else {
      this.persistent_recipes.push(temp_object);
    }

    this.storage.set("persistent_recipes", this.persistent_recipes);
    this.modalController.dismiss();
  }

  // These three arrays hold ingredients, quantities of those ingredients and the units of measurement.
  // The values stored in each array are entered by the user and are pushed to persisten storage when they are done.
  recipe_name:string = ''; // Recipe name
  current_recipe = [];
  persistent_recipes:any; // Persistent recipes

  // All valid units of measurement used by the app.
  units:Array<string> = ["gram", "kilogram", "millilitre", "litre", "cup", "jar", "unit"];

  // Used to perform different actions depending on whether a new recipe is being
  // created or an existing one is being edited.
  editing:boolean = false;
  index:number;
}
