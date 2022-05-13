import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ModalController } from '@ionic/angular';
import { PlannerModalPage } from '../planner-modal/planner-modal.page';
import { DatemodalPage } from '../datemodal/datemodal.page';
import { format, parseISO } from 'date-fns'
import { PlannerDate } from '../PlannerDate';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
})

export class PlannerPage implements OnInit {

  constructor(private storage:StorageService, private modalController:ModalController) { }

  async ngOnInit() {
    let all_recipes = await this.storage.get("all_recipes");
    this.recipe_names = this.storage.getRecipeNames(all_recipes);
    this.planner_dates = await this.storage.get("planner_dates");
    this.end_date = await this.storage.get("end_date")
    this.end_date_readable = format(parseISO(this.end_date), 'MMM d, yyyy');
  }

  ngOnDestroy() {
    this.storage.set("planner_dates", this.planner_dates);
    this.storage.set("end_date", this.end_date);
  }


  // Present the "change date" modal
  async presentDateModal() {
    const modal = await this.modalController.create({
      component: DatemodalPage,
      // Pass the current date as well as the formatted_dates array
      componentProps: {now_date: this.now_date, planner_dates: this.planner_dates, end_date: this.end_date}
      });

    modal.onDidDismiss().then((data) => {
      if (data.data != null) {
        this.planner_dates = data.data;
        this.end_date = data.role;
        this.end_date_readable = format(parseISO(data.role), 'MMM d, yyyy');
      }
    });
    
    return (modal.present());
  }

  // Present the "add recipes" modal.
  async presentAddModal(planner_date:PlannerDate, index:number) {
    const modal = await this.modalController.create({
      component: PlannerModalPage,
      // Pass the PlannerDate to the modal
      componentProps: {planner_date: planner_date, all_recipe_names: this.recipe_names, index: index}
      });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      this.planner_dates[data.data.index] = data.data.planner_date;
    });
    
    return (modal.present());
  }

  // Update planner_dates in ionic storage after checking a recipe
  checkRecipe() {
    this.storage.set("planner_dates", this.planner_dates);
  }


  end_date:string; // The date the user's shop is supposed to last until. Bound with [(ngModel)] to the ion-datetime.
  end_date_readable:string; // The end date but in the form Month day, year. E.g. "May 7, 2022". 
  now_date:Date = new Date(); // The current date.

  // Array of PlannerDates
  // Used to generate the day-by-day planner with *ngFor and for generating the chart on the statistics page.
  planner_dates:Array<PlannerDate> = [];

  recipe_names:Array<string>; // All recipe names, placeholder until separate arrays of ingredients for each day exists.

}
