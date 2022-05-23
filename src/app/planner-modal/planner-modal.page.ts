import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { RecipeService, Recipe, PlannerDate, m_Observer } from '../services/recipe.service';

@Component({
  selector: 'app-planner-modal',
  templateUrl: './planner-modal.page.html',
  styleUrls: ['./planner-modal.page.scss'],
})

export class PlannerModalPage implements OnInit {

  constructor(private navParams:NavParams, private modalController:ModalController, private recipeService:RecipeService) {
  }

  async ngOnInit() {

    // Get all_recpies from observable.
    await this.recipeService.subscribe(this.recipes_observer);
    this.all_recipes = this.recipes_observer.data;

    // Retrieve PlannerDate from NavParams.
    this.planner_date = this.navParams.get("planner_date");

    // Find which recipes are and are not alreay assigned to another PlannerDate.
    for (let recipe of this.all_recipes) {
      if (recipe.date_assigned_to != undefined && recipe.date_assigned_to?.getTime() != this.planner_date.date_ISO.getTime()) {
        this.already_assigned_recipes.push(recipe);
      }
      else if (recipe.date_assigned_to == undefined || recipe.date_assigned_to?.getTime() == this.planner_date.date_ISO.getTime()) {
        this.not_already_assigned_recipes.push(recipe);
      }
    }

    // Find which recipes are already assigned to this date. Set to true in this.recipe_indices.
    for (let i = 0; i < this.not_already_assigned_recipes.length; i++) {
      if (this.not_already_assigned_recipes[i].date_assigned_to?.getTime() == this.planner_date.date_ISO?.getTime()) {
        this.recipe_indices[i] = true;
      }
    }

    this.finished_loading = true;
  }

  closeModalDontSubmit() {
    this.modalController.dismiss();
  }

  closeModalAndSubmit() {
    // Set the date of recipes in not_already_assigned_recipes
    for (let i = 0; i < this.recipe_indices.length; i++) {
      // If the recipe is checked.
      if (this.recipe_indices[i] == true) {
        this.not_already_assigned_recipes[i].date_assigned_to = this.planner_date.date_ISO;
      }
      // If the recipe is unchecked.
      else {
        this.not_already_assigned_recipes[i].date_assigned_to = undefined;
        this.not_already_assigned_recipes[i].cooked = false;
      }
    }

    // Overwrite recipes in all_recipes with the updated versions from not_already_assigned_recipes.
    for (let recipe of this.all_recipes) {
      for (let non_assigned of this.not_already_assigned_recipes) {
        if (recipe.name == non_assigned.name) {
          recipe.date_assigned_to = non_assigned.date_assigned_to;
        }
      }
    }

    // Update the recipes observable with the new data.
    this.recipeService.setRecipes(this.all_recipes);
    this.modalController.dismiss();
  }


  planner_date:PlannerDate;
  
  recipes_observer:m_Observer = new m_Observer();
  all_recipes:Array<Recipe> = [];
  
  already_assigned_recipes:Array<Recipe> = []; // Recipes which are already assigned to another PlannerDate
  not_already_assigned_recipes:Array<Recipe> = []; // Recipes which are not already assigned to another PlannerDate..

  recipe_indices:Array<boolean> = [false]; // The index positions of recipes in not_already_assigned_recipes to add to the PlannerDate.

  finished_loading:boolean = false;

}
