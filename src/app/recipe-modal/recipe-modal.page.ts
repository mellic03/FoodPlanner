import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Recipe } from '../Recipe';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.page.html',
  styleUrls: ['./recipe-modal.page.scss'],
  providers: [StorageService]
})

export class RecipeModalPage implements OnInit {

  constructor(private navParams:NavParams, private modalController:ModalController, private storage:StorageService) {}

  async ngOnInit() {
    // Load all recipes from persistent storage.
    this.all_recipes = await this.storage.get("all_recipes");

    // If in editing mode, get relevant recipe information.
    this.editing = this.navParams.get('editing');
    if (this.editing) {
      // Get index.
      this.index = this.navParams.get('index')

      // Get recipe name.
      let recipe_object = this.navParams.get('recipe');
      this.recipe_name = recipe_object.name;
      
      this.current_recipe[0] = this.storage.getNames(recipe_object);
      this.current_recipe[0].unshift([]);
      this.current_recipe[1] = this.storage.getQuantities(recipe_object);
      this.current_recipe[1].unshift([]);
      this.current_recipe[2] = this.storage.getUnits(recipe_object);
      this.current_recipe[2].unshift([]);
    }

    else {
      this.current_recipe = [[null], [null], [null], [null]];
    }
  }

  // Adds the unit of measurement for an ingredient to units[], called when a unit of measurement is selected.
  setUnit(unit:string, index:number) {
    this.current_recipe[2][index] = unit;
  }
  
  // Dismisses the modal page.
  closeModal() {
    this.modalController.dismiss();
  }

  // Combines the information in the current_recipe array and adds it to all_recipes.
  // Then replaces all_recipes in ionic storage with the local all_recipes.
  createRecipe(name:string, ingredients_array:Array<string>, quantities_array:Array<number>, units_array:Array<string>) {

    // "blank" object, where "recipe" is the recipe name
    let temp_object = {
      "name": "placeholder",
      "ingredients": []
    };

    // If no recipe name, return
    if (name == "") {
      return(0);
    }
    else {
      // Set recipe name
      temp_object["name"] = name;
    }
    
    // Remove the [] in each array placed by the modal.
    this.current_recipe[0].splice(0, 1);
    this.current_recipe[1].splice(0, 1);
    this.current_recipe[2].splice(0, 1);

    // iterate from 0 to the number of ingredients
    for (let i = 0; i < ingredients_array.length; i++) {
      // don't do anything if the name is blank
      if (ingredients_array[i] != "") {
        temp_object["ingredients"][i] = {
          name: ingredients_array[i],
          quantity: quantities_array[i],
          unit: units_array[i],
          checked: false
        };
      }
    }

    // If in editing mode, replace the object at the correct index with working_object.
    if (this.editing) {
      this.all_recipes[this.index] = temp_object;
    }

    // If not in editing mode, push working_object to persistent storage.
    else {
      this.all_recipes.push(temp_object);
    }

    this.modalController.dismiss(this.all_recipes);
  }


  recipe_name:string = ''; // Recipe name
  current_recipe = [[], [], [], []]; // Array of recipe information.
  all_recipes:any; // Persistent recipes

  // All valid units of measurement used by the app.
  units:Array<string> = ["gram", "kilogram", "millilitre", "litre", "cup", "jar", "unit"];

  // Used to perform different actions depending on whether a new recipe is being
  // created or an existing one is being edited.
  editing:boolean = false;
  index:number;

}
