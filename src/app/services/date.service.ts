import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { m_Observable, m_Observer, Recipe } from './recipe.service';


@Injectable({
  providedIn: 'root'
})
export class DateService {

  stats_data_observable:m_Observable = new m_Observable({
    datasets: [
      {
        label: "Percentage of Food used",
        data: [],
        backgroundColor: ["rgba(105, 99, 215, 1)"]
      }
    ],
    labels: [],
  });

  constructor(private storage:StorageService) {
  }

  /** Subscribes an observer to stats_data_observable.
   * @param observer The observer to subcribe.
   * @returns nothing
  */
  async subscribe(observer:m_Observer) {
    this.stats_data_observable.subscribe(observer);
    this.stats_data_observable.update(await this.storage.get("stats_data"));
  }


  // Calculate the number of days between two dates
  daysBetweenDates(date_1:Date, date_2:Date) {
    return Math.abs(Math.round((date_1.getTime() - date_2.getTime()) / (1000 * 3600 * 24)));
  } 

  // Generate an array of PlannerDates between now and the specified end date.
  generateDates(start, end) {

    let start_date:PlannerDate = new PlannerDate(new Date(start));
    let end_date:PlannerDate = new PlannerDate(new Date(end));

    let temp_array:Array<PlannerDate> = [];
    
    for (let i = 0; i < this.daysBetweenDates(start_date.date_ISO, end_date.date_ISO) + 1; i++) {
      let plannerDate:PlannerDate = new PlannerDate(new Date(start_date.date_ISO.getTime() + i * (1000 * 60 * 60 * 24)));
      temp_array.push(plannerDate);
    }
    
    return(temp_array); // I never want to see this function again.
  }

  // Returns true if dates are the same and false if they are not (not account for time of day).
  areSameDates(date_1:Date, date_2:Date) {
    let temp_date_1 = date_1.setHours(0, 0, 0, 0);
    let temp_date_2 = date_2.setHours(0, 0, 0, 0);
    return (temp_date_1.valueOf() === temp_date_2.valueOf());
  }

}

export class PlannerDate {

  date_ISO:Date;

  day_of_week_alphabetical:string;
  day_of_week:number;
  day_of_month:number;
  month:number;
  year:number;

  // An array of Recipe objects.
  recipes:Array<Recipe> = [];

  constructor(date_ISO) {
    this.date_ISO = date_ISO;
    this.day_of_week = this.date_ISO.getDay();

    let week_days:Array<string> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.day_of_week_alphabetical = week_days[this.day_of_week];

    this.day_of_month = this.date_ISO.getDate();
    this.month = this.date_ISO.getMonth();
    this.year = this.date_ISO.getFullYear();

    this.recipes = [];
  }


  // Add a recipe to the recipe array
  addRecipe(recipe:Recipe) {
    this.recipes.push(recipe);
  }

  // Remove a recipe from the recipe array
  removeRecipe(recipe_name:string) {
    for (let i = 0; i < this.recipes.length; i++) {
        if (this.recipes[i].name == recipe_name) {
          this.recipes.splice(i, 1);
          console.log("Removed: " + recipe_name);
          return (0);
        }
    }
    console.log("Could not find recipe: " + recipe_name);
  }
}

