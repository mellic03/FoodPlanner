import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ModalController } from '@ionic/angular';
import { PlannerModalPage } from '../planner-modal/planner-modal.page';
import { format, parseISO } from 'date-fns'

@Component({
  selector: 'app-planner',
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
})

export class PlannerPage implements OnInit {

  constructor(private storage:StorageService, private modalController:ModalController) { }

  ngOnInit() {
    // Get an array of all recipe names.
    this.storage.get("persistent_recipes").then(val => {
      this.recipe_names = this.storage.getRecipeNames(val);
    });
    // Get the user-specified end date.
    this.storage.get("end_date_input").then(val => {
      this.end_date_input = val;
      this.end_date_formatted = format(parseISO(this.end_date_input), 'MMM d, yyyy');
    });
    // Get the dates array.
    this.storage.get("dates_formatted").then(val => {
      this.dates_formatted = val;
    })
  }

  // Presents the modal.
  async presentModal(date:string) {
    const modal = await this.modalController.create({
      component: PlannerModalPage,
      // Pass the list of recipe names to the modal along with the array of dates and an index position.
      componentProps: {recipe_names: this.recipe_names, date: date}
      });

    modal.onDidDismiss().then((val) => {
      // NOT YET IMPLEMENETED.
      // val["recipes_to_add"] = array of strings
      // val["index"] = number
    });
    
    return (modal.present());
  }

  // Updates end_date_raw on (ionChange) for ion-datetime.
  updateDate() {
    this.end_date_formatted = format(parseISO(this.end_date_input), 'MMM d, yyyy');
    this.storage.set("end_date_input", this.end_date_input);
    this.dates_formatted = this.generateDates();
    this.storage.set("dates_formatted", this.dates_formatted);
  }

  // Calculate the number of days between two dates
  daysBetweenDates(date_1:Date, date_2:Date) {
    return Math.abs(Math.round((date_1.getTime() - date_2.getTime()) / (1000 * 3600 * 24)));
  } 

  // Generate an array of dates between now and the specified date in the form [day of week, yyyy-mm-dd].
  generateDates() {
    let end_date_raw:Date = new Date(this.end_date_input);
    let temp_array_raw:Array<Date> = [];

    // Generate array of ISO 8601 dates.
    for (let i = 0; i < this.daysBetweenDates(this.now_raw, end_date_raw) + 1; i++) {
      temp_array_raw.push( new Date(this.now_raw.getTime() + i * (1000 * 60 * 60 * 24)) );
    }

    // Generate array of dates in the form of [day of week, yyyy-mm-dd].
    let temp_array_formatted:Array<Array<any>> = [];
    let week_days:Array<string> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    temp_array_raw.forEach( x => {
      temp_array_formatted.push([week_days[x.getDay()], x.toISOString().split('T')[0]]);
      }
    );

    console.log(temp_array_formatted);
    return (temp_array_formatted);
  }


  now_raw:Date = new Date() // Raw format of current date.
  now_formatted = this.now_raw.toISOString(); // ISO 8601 format of current date.
  
  end_date_input:string; // The date the user's groceries should last until.
  end_date_formatted:string; // The date the user's groceries should last until in ISO 8601 format.

  dates:Array<Date> = []; // Array containing ISO 8601 dates between the current date and end_date.
  dates_formatted:Array<Array<string>>; // Array containing the same as dates but in the form [day of week, yyyy-mm-dd]
  
  recipe_names:Array<string>; // Array of all recipe names. This is a placeholder until full functionality of the planner is implemented.
}
