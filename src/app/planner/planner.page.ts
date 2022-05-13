import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ModalController } from '@ionic/angular';
import { PlannerModalPage } from '../planner-modal/planner-modal.page';
import { DatemodalPage } from '../datemodal/datemodal.page';
import { format, parseISO } from 'date-fns'

@Component({
  selector: 'app-planner',
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
})

export class PlannerPage implements OnInit {

  constructor(private storage:StorageService, private modalController:ModalController) { }

  // Present the "change date" modal
  async presentDateModal() {
    const modal = await this.modalController.create({
      component: DatemodalPage,
      // Pass the current date as well as the formatted_dates array
      componentProps: {now_date: this.now_date, formatted_dates: this.formatted_dates, end_date: this.end_date}
      });

    modal.onDidDismiss().then((data) => {
      // formatted_dates is altered within the modal, return the array and overwrite the local version.
      if (data.data != null) {
        this.formatted_dates = data.data;
        this.end_date = data.role;
        this.end_date_readable = format(parseISO(data.role), 'MMM d, yyyy');
      }
    });
    
    return (modal.present());
  }

  // Present the "add recipes" modal.
  async presentAddModal(date, index:number) {
    const modal = await this.modalController.create({
      component: PlannerModalPage,
      // Pass the list of recipe names to the modal along with the array of dates and an index position.
      componentProps: {date: date[0], index: index}
      });

    modal.onDidDismiss().then((val) => {
      // NOT YET IMPLEMENETED.
      // val["recipes_to_add"] = array of strings
      // val["index"] = number
    });
    
    return (modal.present());
  }

  async ngOnInit() {
    let all_recipes = await this.storage.get("persistent_recipes");
    this.recipe_names = this.storage.getRecipeNames(all_recipes);
    this.formatted_dates = await this.storage.get("formatted_dates");
    this.end_date = await this.storage.get("end_date")
    this.end_date_readable = format(parseISO(this.end_date), 'MMM d, yyyy');
  }

  ngOnDestroy() {
    this.storage.set("formatted_dates", this.formatted_dates);
    this.storage.set("end_date", this.end_date);
  }


  end_date:string; // The date the user's shop is supposed to last until. Bound with [(ngModel)] to the ion-datetime.
  end_date_readable:string; // The end date but in the form Month day, year. E.g. "May 7, 2022". 
  now_date:Date = new Date(); // The current date.
  

  // Array containing the dates between now_date and end_date in the form [day of week, yyyy-mm-dd].
  // Used to generate the day-by-day planner using *ngFor.
  formatted_dates:Array<Array<string>> = [[]];

  recipe_names:Array<string>; // All recipe names, placeholder until separate arrays of ingredients for each day exists.

}
