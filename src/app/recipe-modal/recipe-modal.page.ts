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
    // load the stored recipes
    this.storage.get("persistent_recipes").then( val => {this.persistentRecipes = val;});

    // If in editing mode, get relevant recipe information.
    this.editing = this.navParams.get('editing');
    if (this.editing) {
      this.index = this.navParams.get('index')
      let recipe = this.navParams.get('recipe');

      // Get recipe name.
      this.recipe_name = this.navParams.get('recipe').name;

      // Get ingredient names.
      this.ingredient_names = this.storage.getIngredientNames(recipe);
      this.ingredient_names.unshift("[]"); // An empty array has to be present at index position 0

      // Get ingredient quantities.
      this.ingredient_quantities = this.storage.getIngredientQuantities(recipe);
      this.ingredient_quantities.unshift("[]"); // An empty array has to be present at index position 0

      // Get ingredient units.
      this.ingredient_units = this.storage.getIngredientUnits(recipe);
      this.ingredient_units.unshift("[]"); // An empty array has to be present at index position 0

      // Get all recipe information.
      this.recipe = this.storage.getNamesQuantitiesUnits(recipe);
    }
  }

  // adds the unit of measurement for an ingredient to units[], called when a unit of measurement is selected.
  setUnit(unit:string, index:number) {
    this.ingredient_units[index] = unit;
  }
  
  closeModal() {
    this.modalController.dismiss();
  }

  // combines the data from the ingredient_names, _quantities and _units
  // arrays to create a javascript object which is added to the persistent_recipes object.
  // The persistent_recipes object then replaces "recipes" in ionic storage.
  createRecipe(name:string, ingredients_array:Array<string>, quantities_array:Array<number>, units_array:Array<string>) {

    // If in editing mode, remove the [] placed by the modal.
    if (this.editing) {
      for (let i = 0; i < this.ingredient_names.length; i++) {
        if (this.ingredient_names[i] == '[]') {
          this.ingredient_names.splice(i, 1);
          this.ingredient_quantities.splice(i, 1);
        }
      }
    }

    // "blank" object, where "recipe" is the recipe name
    let working_object = {
      "name": "recipe",
      "ingredients": []
    };

    // Set recipe name
    working_object["name"] = name;

    // iterate from 0 to the number of ingredients
    for (let i = 0; i < ingredients_array.length; i++) {
      // don't do anything if the name is blank
      if (ingredients_array[i] != "") {
        working_object["ingredients"][i] = {
          name: ingredients_array[i],
          quantity: quantities_array[i],
          unit: units_array[i]
        };
      }
    }

    // If in editing mode, replace the object at the correct index with working_object.
    if (this.editing) {
      this.persistentRecipes[this.index] = working_object;
    }

    // If not in editing mode, push working_object to persistent storage.
    else {
      this.persistentRecipes.push(working_object);
    }

    this.storage.set("persistent_recipes", this.persistentRecipes);
    this.modalController.dismiss();
  }

  // These three arrays hold ingredients, quantities of those ingredients and the units of measurement.
  // The arrays are then merged into a javascript object and sent to persistent storage.
  recipe_name:string = ''; // Recipe name
  ingredient_names = ['']; // values added using [(ngModel)]
  ingredient_quantities = []; // values added using [(ngModel)]
  ingredient_units = [] // values added using this.setUnit()
  persistentRecipes:any; // Persistent recipes

  recipe:any = [];

  units:Array<string> = ["gram", "kilogram", "cup", ""];

  // Used to perform different actions depending on whether a new recipe is being
  // created or an existing one is being edited.
  editing:boolean = false;
  index:number;
}
