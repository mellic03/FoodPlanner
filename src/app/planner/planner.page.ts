import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlannerModalPage } from '../planner-modal/planner-modal.page';
import { DatemodalPage } from '../datemodal/datemodal.page';
import { format, parseISO } from 'date-fns'
import { RecipeService, Recipe, Ingredient, PlannerDate, m_Observable, m_Observer } from '../services/recipe.service';


@Component({
  selector: 'app-planner',
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
})

export class PlannerPage implements OnInit {

  constructor(private recipeService:RecipeService, private modalController:ModalController) { }


  async ngOnInit() {
    
    await this.recipeService.subscribe(this.recipes_observer);
    this.all_recipes = this.recipes_observer.data

    this.planner_dates = await this.recipeService.getPlannerDates();
    this.planner_end_date = await this.recipeService.getPlannerEndDate();
    this.planner_end_date_readable = format(parseISO(this.planner_end_date), 'MMM d, yyyy');
  }

  ngOnDestroy() {
    this.recipeService.setPlannerDates(this.planner_dates);
    this.recipeService.setPlannerEndDate(this.planner_end_date);
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
        
        this.recipeService.setPlannerStartDate(data.data.start_date);
        this.recipeService.setPlannerEndDate(data.data.end_date);
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
      
      console.log(data.data)


    });
    
    return (modal.present());
  }

  // Update planner dates in ionic storage after checking a recipe
  checkRecipe(index:number) {
    for (let planner_date_recipe of this.planner_dates[index].recipes) {
      for (let i = 0; i < this.all_recipes.length; i++) {
        // If recipe.name is in both planner date and in all_recipes, then update the recipe in all_recipes.
        if (planner_date_recipe.name == this.all_recipes[i].name) {
          this.all_recipes[i] = planner_date_recipe;
        }
      }
    }
    this.recipeService.setPlannerDates(this.planner_dates);
    this.recipeService.setRecipes(this.all_recipes);
  }


  planner_end_date:string; // The date the user's shop is supposed to last until. Bound with [(ngModel)] to the ion-datetime.
  planner_end_date_readable:string; // The end date but in the form Month day, year. E.g. "May 7, 2022". 
  now_date:Date = new Date(); // The current date.

  // Array of PlannerDates
  // Used to generate the day-by-day planner with *ngFor and for generating the chart on the statistics page.
  planner_dates:Array<PlannerDate> = [];

  recipe_names:Array<string>;

  recipes_observer:m_Observer = new m_Observer();
  all_recipes:Array<Recipe>;

}
