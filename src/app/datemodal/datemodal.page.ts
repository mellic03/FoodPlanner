import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { PlannerDate } from '../PlannerDate';

@Component({
  selector: 'app-datemodal',
  templateUrl: './datemodal.page.html',
  styleUrls: ['./datemodal.page.scss'],
})
export class DatemodalPage implements OnInit {

  constructor(private modalController:ModalController, private navParams:NavParams) { }

  async ngOnInit() {
    this.end_date = await this.navParams.get("end_date");
  }

  closeModal(submit_data:boolean) {
    if (submit_data) {
      let date_array = this.generateDates(this.now_date, this.end_date);
      this.modalController.dismiss(date_array, this.end_date);
    }
    else {
      this.modalController.dismiss();
    }
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
    let week_days:Array<string> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    for (let i = 0; i < this.daysBetweenDates(start_date.date_ISO, end_date.date_ISO) + 1; i++) {
      let plannerDate:PlannerDate = new PlannerDate(new Date(start_date.date_ISO.getTime() + i * (1000 * 60 * 60 * 24)));
      temp_array.push(plannerDate);
    }
    
    return(temp_array); // I never want to see this function again.
  }

  now_date:Date = new Date();
  now_date_datetime:string = new Date().toISOString(); // The current date but compatible with ion-datetime
  end_date:string; // The date the user's shop is supposed to last until. Bound with [(ngModel)] to the ion-datetime.

}
