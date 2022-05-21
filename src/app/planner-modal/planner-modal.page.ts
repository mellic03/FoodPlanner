import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { RecipeService, Recipe, PlannerDate, m_Observer } from '../services/recipe.service';

@Component({
  selector: 'app-planner-modal',
  templateUrl: './planner-modal.page.html',
  styleUrls: ['./planner-modal.page.scss'],
})

export class PlannerModalPage implements OnInit {

  constructor(private navParams:NavParams, private modalController:ModalController, private recipeService:RecipeService) { }

  ngOnInit() {
    
    // Retrieve PlannerDate from NavParams.
    this.planner_date = this.navParams.get("planner_date");

  }



  doStuff() {

    this.recipeService.subscribe(this.planner_date.recipes_observer) // Subscribe PlannerDate to all_recipes observable.

    // plannerDate.updateRecipes()
  }

  planner_date:PlannerDate;



}








/*
  ngOnInit() {

    // Get all_recipes from observable.
    this.recipes_observer = this.navParams.get("recipes_observer");
    this.all_recipes = this.recipes_observer.data;

    // Get current PlannerDate and index position of PlannerDate from NavParams.
    this.planner_date = this.navParams.get("planner_date");
    this.index = this.navParams.get("index");

    // Determine which recipes already exist on that PlannerDate.
    for (let i = 0; i < this.planner_date.recipes.length; i++) {
      for (let j = 0; j < this.all_recipes.length; j++) {
        if (this.planner_date.recipes[i].name == this.all_recipes[j].name) {
          this.recipe_indices[j] = true;
        }
      }
    }
  }
  
  // Dismisses the modal.
  closeModal() {

    // Create array of recipes to add
    let recipes_to_add:Array<Recipe> = [];

    for (let i = 0; i < this.recipe_indices.length; i++) {
      if (this.recipe_indices[i] == true) {
        recipes_to_add.push(this.all_recipes[i]);
      }
    }
    this.modalController.dismiss({recipes_to_add: recipes_to_add, index: this.index});
  }

  day_of_week:string;

  recipes_observer:m_Observer = new m_Observer();;
  all_recipes:Array<Recipe>;

  recipe_indices:Array<boolean> = [];

  planner_date:PlannerDate;
  index:number;
*/