import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';

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

  // Generate an array of dates between now and the specified date in the form [day of week, yyyy-mm-dd].
  generateDates(start, end) {

    let start_date:Date = new Date(start);
    let end_date:Date = new Date(end);

    let temp_array_raw:Array<Date> = [];

    // Generate array of ISO 8601 dates.
    for (let i = 0; i < this.daysBetweenDates(start_date, end_date) + 1; i++) {
      temp_array_raw.push( new Date(start_date.getTime() + i * (1000 * 60 * 60 * 24)) );
    }

    // Generate array of dates in the form of [day of week, yyyy-mm-dd].
    let temp_array_formatted:Array<Array<any>> = [];
    let week_days:Array<string> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    temp_array_raw.forEach( x => {
      temp_array_formatted.push([week_days[x.getDay()], x.toISOString().split('T')[0]]);
      }
    );

    return(temp_array_formatted);
  }

  now_date:Date = new Date();
  now_date_datetime:string = new Date().toISOString(); // The current date but compatible with ion-datetime
  end_date:string; // The date the user's shop is supposed to last until. Bound with [(ngModel)] to the ion-datetime.

}
