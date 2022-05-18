import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Recipe, PlannerDate } from '../services/recipe.service';

@Component({
  selector: 'app-planner-modal',
  templateUrl: './planner-modal.page.html',
  styleUrls: ['./planner-modal.page.scss'],
})

export class PlannerModalPage implements OnInit {

  constructor(private navParams:NavParams, private modalController:ModalController) { }

  ngOnInit() {
    this.planner_date = this.navParams.get("planner_date");
    this.all_recipes = this.navParams.get("all_recipes");
    this.index = this.navParams.get("index");
  }
  
  // Dismisses the modal.
  closeModal() {
    // Create array of recipes to add
    for (let i = 0; i < this.recipe_indices.length; i++) {
      if (this.recipe_indices[i] == true) {
        this.planner_date.recipes.push(this.all_recipes[i]);
      }
    }
    this.modalController.dismiss({planner_date: this.planner_date, index: this.index});
  }

  day_of_week:string;

  all_recipes:Array<Recipe>;
  recipe_indices:Array<boolean> = [];
  planner_date:PlannerDate;
  index:number;
}
