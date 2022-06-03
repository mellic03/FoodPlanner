import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { RecipeService, Recipe, m_Observer } from '../services/recipe.service';
import { PlannerDate } from '../services/date.service';
import { Router, RouterModule } from '@angular/router';
import { RecipeModalPage } from '../recipe-modal/recipe-modal.page';

@Component({
  selector: 'app-planner-modal',
  templateUrl: './planner-modal.page.html',
  styleUrls: ['./planner-modal.page.scss'],
})

export class PlannerModalPage implements OnInit {

  constructor(private navParams:NavParams,
    private router:Router,
    private modalController:ModalController,
    private recipeService:RecipeService) {
  }

  async ngOnInit() {

    await this.sortRecipes();

    this.finished_loading = true;
  }

  
  // Sorts through the recipe array to show only recipes which are not already assigned to another PlannerDate
  async sortRecipes() {
    // Get all_recpies from observable.
    await this.recipeService.subscribe(this.recipes_observer);
    this.all_recipes = this.recipes_observer.data;

    // Retrieve PlannerDate from NavParams.
    this.planner_date = this.navParams.get("planner_date");

    // Find which recipes are and are not alreay assigned to another PlannerDate.
    for (let recipe of this.recipes_observer.data) {
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

    this.recipeService.setRecipes(this.all_recipes);
  }


  // Dismiss modal without sending data through NavParams
  closeModalDontSubmit() {
    this.modalController.dismiss();
  }

  // Dismiss modal sending data through NavParams
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

    //console.log(this.all_recipes);

    // Update the recipes observable with the new data.
    this.recipeService.setRecipes(this.all_recipes);
    this.modalController.dismiss();
  }

  // Navigate to the recipes page
  navToRecipePage() {
    this.router.navigateByUrl("recipes");
    this.closeModalDontSubmit();
  }

  // Presents the add/edit recipe modal. If editing the index i of a recipe is passed and editing is set to true.
  async presentAddRecipeModal(recipe:Recipe = undefined, editing:boolean = false, index:number = undefined) {
    const modal = await this.modalController.create({
      component: RecipeModalPage,
      // If editing, passes the recipe being edited along with a boolean called editing and the index of the recipe.
      componentProps: {recipe: recipe, editing: editing, index: index}
    });

    modal.onDidDismiss().then(() => {
      this.sortRecipes();
    });
    return (modal.present());
  }

  planner_date:PlannerDate;
  
  recipes_observer:m_Observer = new m_Observer();
  all_recipes:Array<Recipe> = [];
  
  already_assigned_recipes:Array<Recipe> = []; // Recipes which are already assigned to another PlannerDate
  not_already_assigned_recipes:Array<Recipe> = []; // Recipes which are not already assigned to another PlannerDate..

  recipe_indices:Array<boolean> = [false]; // The index positions of recipes in not_already_assigned_recipes to add to the PlannerDate.

  finished_loading:boolean = false;

}
