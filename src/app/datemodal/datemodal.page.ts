import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { RecipeService, m_Observer } from '../services/recipe.service';
import { DateService } from '../services/date.service';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-datemodal',
  templateUrl: './datemodal.page.html',
  styleUrls: ['./datemodal.page.scss'],
})

export class DatemodalPage implements OnInit {

  constructor(private localNotifications:LocalNotifications, private dateService:DateService, private modalController:ModalController, private navParams:NavParams, private recipeService:RecipeService) { }

  async ngOnInit() {
    this.end_date = await this.navParams.get("end_date");
  }

  // Close modal without sending data through NavParams
  closeModalDontSubmit() {
    this.modalController.dismiss();
  }

  // Close modal sending data through NavParams.
  async closeModalAndSubmit() {
    // Set all recipe.date_assigned_to as undefined and cooked to false for all recipes.
    await this.recipeService.subscribe(this.recipes_observer);
    for (let recipe of this.recipes_observer.data) {
      recipe.date_assigned_to = undefined;
      recipe.cooked = false;
    }
    this.recipeService.setRecipes(this.recipes_observer.data);
    
    // Generate array of PlannerDates between now and the specified end date.
    let date_array = this.dateService.generateDates(this.now_date, this.end_date);

    // Ask for notification permission, if given, schedule notification.
    this.localNotifications.requestPermission();
    if (this.localNotifications.hasPermission()) {
      this.scheduleNotification(this.end_date);
    }

    // Dismiss modal
    this.modalController.dismiss({date_array: date_array, start_date: this.now_date, end_date: this.end_date});
  }

  // Schedules a notification at a given time.
  scheduleNotification(date:string | Date) {
    console.log("scheduling notification for", date);
    this.localNotifications.schedule({
      id: 1,
      title: "You've reached the end of the schedule",
      text: "Tap to make another one",
      trigger: {at: new Date(new Date(date).getTime()) }
    })
  }

  now_date:Date = new Date();
  now_date_datetime:string = new Date().toISOString(); // The current date but compatible with ion-datetime
  end_date:string; // The date the user's shop is supposed to last until. Bound with [(ngModel)] to the ion-datetime.

  recipes_observer:m_Observer = new m_Observer();
}

