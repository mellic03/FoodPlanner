import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipeService, Recipe, Ingredient, m_Observable, m_Observer } from '../services/recipe.service';
import { PlannerDate } from '../services/date.service';
import { DateService } from '../services/date.service';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements ViewWillEnter {

  @ViewChild('food_usage_chart', {static: true}) canvas;
  chart:any;
  
  constructor(private recipeService:RecipeService, private dateService:DateService, private router:Router) { }

  data = {
    datasets: [{
      label: "% of recipes used",
      data: [0],
      backgroundColor: ["rgba(105, 99, 215, 1)"]
    },
    {
      label: "% of Ingredients used",
      data: [0],
      backgroundColor: ["rgba(228, 151, 0, 1)"]
    }],
    labels: [],
  }

  async ionViewWillEnter() {
    await this.recipeService.subscribe(this.recipes_observer);
    this.all_recipes = this.recipes_observer.data;
    
    this.planner_dates = await this.dateService.getPlannerDates();

    if (this.planner_dates?.[0] != null) {

      // Create x-axis labels of dates
      for (let planner_date of this.planner_dates) {
        this.data.labels.push(planner_date.day_of_month + "/" + planner_date.month);
        this.data.datasets[0].data.push(0);
        this.data.datasets[1].data.push(0);
      }
  
      this.calculateRecipeProgress();
      this.calculateIngredientProgress();
      this.calculateTimeProgress();
      this.getDataPerDay();

      this.chart = new Chart(this.canvas.nativeElement, {
        type: 'bar',
        data: this.data
      });
    }
  }

  // Assigns the proportion of recipes that have been cooked to each date.
  getDataPerDay() {

    for (let planner_date of this.planner_dates) {
      planner_date.recipes = [];
    }

    // use new recipe array for each PlannerDate
    for (let planner_date of this.planner_dates) {
      for (let recipe of this.all_recipes) {
        if (recipe.date_assigned_to?.getTime() == planner_date.date_ISO?.getTime()) {
          planner_date.recipes.push(recipe);
        }
      }
    }

    // For each PlannerDate, no_recipes / no_all_recipes. no_ing / no_all_ing
    for (let i = 0; i < this.planner_dates.length; i++) {

      let number_of_cooked_ingredients:number = 0;
      let number_of_cooked_recipes:number = 0;

      this.planner_dates[i].recipes.forEach((recipe) => {
        if (recipe.cooked) {
          number_of_cooked_recipes += 1;
          recipe.ingredients.forEach(() => {
            number_of_cooked_ingredients += 1;
          })
        }
        this.data.datasets[0].data[i] = 100 * (number_of_cooked_recipes / this.number_of_recipes);
        this.data.datasets[1].data[i] = 100 * (number_of_cooked_ingredients / this.food_ingredients_total);
      })
    }

  }

  // Calculates the proportion of recipes that have been cooked.
  calculateRecipeProgress() {
    this.number_of_recipes = this.all_recipes.length;

    this.all_recipes.forEach((recipe) => {
      if (recipe.cooked == true) { this.number_of_cooked_recipes += 1; }
    })

    this.recipe_progress_bar = 1 - (this.number_of_cooked_recipes / this.number_of_recipes);
  }

  // Calculates the proportion of ingredients that has not been "checked".
  calculateIngredientProgress() {
    // Get number of ingredients
    let number_of_ingredients:number = this.recipeService.getAllIngredientsWithDuplicates(this.all_recipes).length;
    this.food_ingredients_total = number_of_ingredients;

    // Get number of ingredients in cooked recipes.
    // First, get all cooked recipes
    let cooked_recipes:Array<Recipe> = [];
    for (let recipe of this.all_recipes) {
      if (recipe.cooked == true) {
        cooked_recipes.push(recipe);
      }
    }
    // Second, get all ingredients in cooked_recipes
    let cooked_ingredients:Array<Ingredient> = this.recipeService.getAllIngredientsWithDuplicates(cooked_recipes);
    let number_of_cooked_ingredients:number = cooked_ingredients.length;
    this.food_ingredients_left = number_of_ingredients - number_of_cooked_ingredients;

    // Get array of checked/cooked recipes.
    let number_of_cooked_recipes:number = 0;
    for (let recipe of this.all_recipes) {
      if (recipe.cooked == true) {
        number_of_cooked_recipes += 1;
      }
    }

    this.ingredient_progress_bar = 1 - (number_of_cooked_ingredients / number_of_ingredients);
  }

  // Calculates the time progressed as a percentage towards the planner's end date since it was set by the user.
  async calculateTimeProgress() {

    let start_date = new Date(await this.dateService.getPlannerStartDate());
    let end_date = new Date(await this.dateService.getPlannerEndDate());
    let now_date = new Date();

    let date_difference:number = end_date.getTime() - start_date.getTime();
    this.time_progress_bar = 1 - ((now_date.getTime() - start_date.getTime()) / date_difference);
    let time_ms_left:number = end_date.getTime() - now_date.getTime();

    let days_left:number = time_ms_left / 86400000;
    this.time_days_left = Math.floor(days_left);
    this.time_hours_left = Math.round((days_left - this.time_days_left) * 24);
    
  }

  // Navigate to the planner page.
  navToPlanner() {
    this.router.navigateByUrl("planner");
  }

  planner_dates:Array<PlannerDate> = [];

  recipes_observer:m_Observer = new m_Observer();
  all_recipes:Array<Recipe>;

  recipe_progress_bar:number;
  number_of_recipes:number;
  number_of_cooked_recipes:number = 0;

  ingredient_progress_bar:number;
  food_ingredients_left:number;
  food_ingredients_total:number;

  time_progress_bar:number;
  time_days_left:number;
  time_hours_left:number;

  stats_data_observer:m_Observer = new m_Observer();
}
