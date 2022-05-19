import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Recipe, PlannerDate, m_Observer  } from '../services/recipe.service';

@Component({
  selector: 'app-planner-modal',
  templateUrl: './planner-modal.page.html',
  styleUrls: ['./planner-modal.page.scss'],
})

export class PlannerModalPage implements OnInit {

  constructor(private navParams:NavParams, private modalController:ModalController) { }

  ngOnInit() {
    this.planner_dates = this.navParams.get("planner_dates"); // The individual PlannerDate that is being edited.
    this.index = this.navParams.get("index");
    this.planner_date = this.planner_dates[this.index];
    this.all_recipes = this.navParams.get("all_recipes");

    // Determine which recipes already exist on that day.
    for (let i = 0; i < this.planner_date.recipes.length; i++) {
      for (let j = 0; j < this.all_recipes.length; j++) {
        if (this.planner_date.recipes[i].name == this.all_recipes[j].name) {
          this.recipe_indices[j] = true;
        }
      }
    }
  }
  
  // Dismisses the modal.
  closeModal() {

    // Create array of recipes to add
    let recipes_to_add:Array<Recipe> = [];

    for (let i = 0; i < this.recipe_indices.length; i++) {
      if (this.recipe_indices[i] == true) {
        recipes_to_add.push(this.all_recipes[i]);
      }
    }
    this.modalController.dismiss({recipes_to_add: recipes_to_add, index: this.index});
  }

  day_of_week:string;

  all_recipes:Array<Recipe>;
  recipe_indices:Array<boolean> = [];
  planner_dates:Array<PlannerDate>;
  planner_date:PlannerDate;
  index:number;
}
