import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-planner-modal',
  templateUrl: './planner-modal.page.html',
  styleUrls: ['./planner-modal.page.scss'],
})
export class PlannerModalPage implements OnInit {

  constructor(private navParams:NavParams, private modalController:ModalController) { }

  ngOnInit() {
    this.day_of_week = this.navParams.get("date");
    this.recipe_names = this.navParams.get("recipe_names");
  }
  
  // Dismisses the modal.
  closeModal() {
    this.modalController.dismiss({recipes_to_add: this.recipes_to_add, index: this.index});
  }

  day_of_week:string;

  recipe_names:Array<string>;
  recipes_to_add:Array<string> = [];
  index:number;
}
