import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipeService, Recipe, Ingredient, PlannerDate, m_Observable, m_Observer } from '../services/recipe.service';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {

  @ViewChild('food_usage_chart', {static: true}) canvas;
  chart:any;
  
  constructor(private recipeService:RecipeService, private router:Router) { }

  // Chart needs to read dates from date array and plot the last two weeks of dates

  data = {
    datasets: [{
      label: "Percentage of Food used",
      data: [4, 5, 5, 4, 2, 3, 2, 1],
      backgroundColor: ["rgba(105, 99, 215, 1)"]
    }],
    labels: [],
  }

  async ngOnInit() {
    
    await this.recipeService.subscribe(this.recipes_observer);
    this.all_recipes = this.recipes_observer.data;
    
    this.planner_dates = await this.recipeService.getPlannerDates();
    
    if (this.planner_dates?.[0] != null) {

      // Create x-axis labels of dates
      for (let planner_date of this.planner_dates) {
        this.data.labels.push(planner_date.day_of_month + "/" + planner_date.month);
      }
  
      this.calculateFoodProgress();
      this.calculateTimeProgress();

      this.chart = new Chart(this.canvas.nativeElement, {
        type: 'bar',
        data: this.data
      });
    }
  }


  // Calculates the proportion of food that has not been "checked".
  calculateFoodProgress() {
    // Get number of ingredients
    let number_of_ingredients:number = this.recipeService.getAllIngredients(this.all_recipes).length;
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
    let cooked_ingredients:Array<Ingredient> = this.recipeService.getAllIngredients(cooked_recipes);
    let number_of_cooked_ingredients:number = cooked_ingredients.length;
    this.food_ingredients_left = number_of_ingredients - number_of_cooked_ingredients;

    // Get array of checked/cooked recipes.
    let number_of_cooked_recipes:number = 0;
    for (let recipe of this.all_recipes) {
      if (recipe.cooked == true) {
        number_of_cooked_recipes += 1;
      }
    }

    this.food_progress_bar = 1 - (number_of_cooked_ingredients / number_of_ingredients);
  }

  // Calculates the time progressed as a percentage towards the planner's end date since it was set by the user.
  async calculateTimeProgress() {

    let start_date = new Date(await this.recipeService.getPlannerStartDate());
    let end_date = new Date(await this.recipeService.getPlannerEndDate());
    let now_date = new Date();

    let date_difference:number = end_date.getTime() - start_date.getTime();
    this.time_progress_bar = ((now_date.getTime() - start_date.getTime()) / date_difference);
    let time_ms_left:number = end_date.getTime() - now_date.getTime();

    let days_left:number = time_ms_left / 86400000;
    this.time_days_left = Math.floor(days_left);
    this.time_hours_left = Math.round((days_left - this.time_days_left) * 24);
    
  }

  navToPlanner() {
    this.router.navigateByUrl("planner");
  }

  planner_dates:Array<PlannerDate> = [];

  recipes_observer:m_Observer = new m_Observer();
  all_recipes:Array<Recipe>;

  food_progress_bar:number;
  food_ingredients_left:number;
  food_ingredients_total:number;

  time_progress_bar:number;
  time_days_left:number;
  time_hours_left:number;
}
