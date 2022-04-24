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

  ngOnInit() {}

  ionViewDidEnter() {
    // load the stored recipes
    this.storage.get("recipes_uncooked").then( val => {this.persistentRecipes = val;});
  }

  closeModal(submit:boolean) {
    if (submit) {
      this.modalController.dismiss(this.persistentRecipes);
    }
    else if (!submit) {
      this.modalController.dismiss();
    }
  }

  // adds the unit of measurement for an ingredient to units[], called when a unit of measurement is selected.
  setUnit(unit:string, index:number) {
    this.ingredient_units[index] = unit;
  }
  
  // combines the data from the ingredient_names, _quantities and _units
  // arrays to create a javascript object which will be added to the persistent recipes object
  createRecipe(name:string, ingredients_array:Array<string>, quantities_array:Array<number>, units_array:Array<string>) {
    
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
    this.persistentRecipes.push(working_object);
    this.storage.set("recipes_uncooked", this.persistentRecipes);
    this.closeModal(true);
  }

  // These three arrays hold ingredients, quantities of those ingredients and the units.
  // The arrays are then turned into json objects for storage in "recipes"
  recipe_name:string = ''; // Recipe name
  ingredient_names = ['']; // values added using [(ngModel)]
  ingredient_quantities = []; // values added using [(ngModel)]
  ingredient_units = [] // values added using this.setUnit()

  persistentRecipes:any; // Persistent recipes
}
