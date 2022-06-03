import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ViewWillLeave } from '@ionic/angular';
import { PlannerModalPage } from '../planner-modal/planner-modal.page';
import { DatemodalPage } from '../datemodal/datemodal.page';
import { format, parseISO } from 'date-fns'
import { RecipeService, Recipe, Ingredient, m_Observable, m_Observer } from '../services/recipe.service';
import { DateService, PlannerDate } from '../services/date.service';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
})

export class PlannerPage implements OnInit, ViewWillLeave {

  constructor(private recipeService:RecipeService, private dateService:DateService, private modalController:ModalController) { }
  
  async ngOnInit() {
    
    await this.recipeService.subscribe(this.recipes_observer);
    this.all_recipes = this.recipes_observer.data

    this.planner_dates = await this.dateService.getPlannerDates();
    if (this.planner_dates != null) {
      this.planner_end_date = await this.dateService.getPlannerEndDate();
      this.planner_end_date_readable = format(parseISO(this.planner_end_date), 'MMM d, yyyy');
      this.updatePlannerDates();
    }
    
    this.finished_loading = true;
  }
  
  ngOnDestroy() {

  }

  async ionViewWillLeave() {
    if (this.planner_dates != null) {
      // Clear PlannerDate recipes in order to avoid having to store them.
      await this.dateService.clearPlannerDateRecipes(this.planner_dates);
      // Store end date.
      this.dateService.setPlannerEndDate(this.planner_end_date);
    }
  }

  // Retrieves recipes data from the recipes observable,
  // then sorts the data and finds which recipes belong to which PlannerDate.
  updatePlannerDates() {

    let all_recipes = this.recipes_observer.data;

    for (let planner_date of this.planner_dates) {
      planner_date.recipes = [];
    }

    // use new recipe array for each PlannerDate
    for (let planner_date of this.planner_dates) {
      for (let recipe of all_recipes) {
        if (recipe.date_assigned_to?.getTime() == planner_date.date_ISO?.getTime()) {
          planner_date.recipes.push(recipe);
        }
      }
    }
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
        
        this.dateService.setPlannerStartDate(data.data.start_date);
        this.dateService.setPlannerEndDate(data.data.end_date);
      }
    });
    
    return (modal.present());
  }

  // Present the "add recipes" modal.
  async presentAddModal(planner_date:PlannerDate) {
    const modal = await this.modalController.create({
      component: PlannerModalPage,
      // Pass the PlannerDate of the currently viewed date to the modal.
      componentProps: {planner_date: planner_date}
      });

    modal.onDidDismiss().then((data) => {
      this.updatePlannerDates();
    });
    
    return (modal.present());
  }

  // Update planner dates in ionic storage after checking a recipe
  checkRecipe(index:number) {

    let all_recipes = this.recipes_observer.data;
    let planner_recipes = this.planner_dates[index].recipes

    for (let i = 0; i < planner_recipes.length; i++) {
      for (let j = 0; j < all_recipes.length; j++) {
        if (planner_recipes[i].name == all_recipes[j].name) {
          all_recipes[j].cooked = all_recipes[j].cooked;
        }
      }
    }

    // Update recipe observable
    this.recipeService.setRecipes(all_recipes);
  }


  planner_end_date:string; // The date the user's shop is supposed to last until. Bound with [(ngModel)] to the ion-datetime.
  planner_end_date_readable:string; // The end date but in the form Month day, year. E.g. "May 7, 2022". 
  now_date:Date = new Date(); // The current date.

  // Array of PlannerDates
  // Used to generate the day-by-day planner with *ngFor and for generating the chart on the statistics page.
  planner_dates_observer:m_Observer = new m_Observer();
  planner_dates:Array<PlannerDate> = [];

  recipes_observer:m_Observer = new m_Observer();
  all_recipes:Array<Recipe>;

  finished_loading:boolean = false;
}
