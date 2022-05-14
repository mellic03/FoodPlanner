import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ModalController } from '@ionic/angular';
import { PlannerModalPage } from '../planner-modal/planner-modal.page';
import { DatemodalPage } from '../datemodal/datemodal.page';
import { format, parseISO } from 'date-fns'
//import { PlannerDate } from '../PlannerDate';
import { Recipe, Ingredient, PlannerDate } from '../Recipe';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
})

export class PlannerPage implements OnInit {

  constructor(private storage:StorageService, private modalController:ModalController) { }

  ngOnInit() {
    this.storage.get("all_recipes").then((val) => {
      this.all_recipes = val;
    });
    this.storage.get("planner_dates").then((val) => {
      this.planner_dates = val;
    });
    this.storage.get("planner_end_date").then((val) => {
      this.planner_end_date = val;
      this.planner_end_date_readable = format(parseISO(this.planner_end_date), 'MMM d, yyyy');
    });

  }

  ngOnDestroy() {
    this.storage.set("planner_dates", this.planner_dates);
    this.storage.set("planner_end_date", this.planner_end_date);
  }

  // Present the "change date" modal
  async presentDateModal() {
    const modal = await this.modalController.create({
      component: DatemodalPage,
      // Pass the current date as well as the formatted_dates array
      componentProps: {now_date: this.now_date, planner_dates: this.planner_dates, end_date: this.planner_end_date}
      });

    modal.onDidDismiss().then((data) => {
      if (data.data != null) {

        this.planner_dates = data.data.date_array;
        this.planner_end_date = data.data.end_date;
        this.planner_end_date_readable = format(parseISO(data.data.end_date), 'MMM d, yyyy');
        
        this.storage.set("planner_start_date", data.data.start_date); // The date the planner schedule was set.
        this.storage.set("planner_end_date", data.data.end_date); // The date the planner schedule is set to end.
      }
    });
    
    return (modal.present());
  }

  // Present the "add recipes" modal.
  async presentAddModal(planner_date:PlannerDate, index:number) {
    const modal = await this.modalController.create({
      component: PlannerModalPage,
      // Pass the PlannerDate to the modal
      componentProps: {planner_date: planner_date, all_recipes: this.all_recipes, index: index}
      });

    modal.onDidDismiss().then((data) => {
      this.planner_dates[data.data.index] = data.data.planner_date;
    });
    
    return (modal.present());
  }

  // Update planner_dates in ionic storage after checking a recipe
  checkRecipe(index:number) {
    for (let planner_date_recipe of this.planner_dates[index].recipes) {
      for (let i = 0; i < this.all_recipes.length; i++) {
        // If recipe.name is in both planner date and in all_recipes, then update the recipe in all_recipes.
        if (planner_date_recipe.name == this.all_recipes[i].name) {
          this.all_recipes[i] = planner_date_recipe;
        }
      }
    }
    this.storage.set("planner_dates", this.planner_dates);
    this.storage.set("all_recipes", this.all_recipes);
  }

  planner_end_date:string; // The date the user's shop is supposed to last until. Bound with [(ngModel)] to the ion-datetime.
  planner_end_date_readable:string; // The end date but in the form Month day, year. E.g. "May 7, 2022". 
  now_date:Date = new Date(); // The current date.

  // Array of PlannerDates
  // Used to generate the day-by-day planner with *ngFor and for generating the chart on the statistics page.
  planner_dates:Array<PlannerDate> = [];

  recipe_names:Array<string>; // All recipe names, placeholder until separate arrays of ingredients for each day exists.

  all_recipes:Array<Recipe>;
}
