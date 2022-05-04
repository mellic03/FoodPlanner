import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ModalController } from '@ionic/angular';
import { PlannerModalPage } from '../planner-modal/planner-modal.page';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
})

export class PlannerPage implements OnInit {

  constructor(private storage:StorageService, private modalController:ModalController) { }

  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: PlannerModalPage,
        // Do stuff
      });

    modal.onDidDismiss().then(() => {
      this.storage.get("persistent_recipes").then( val => {
        // Do stuff
      });
    });
    
    return (modal.present());
  }

  days_of_week = [["03 / 05 / 2022", ["Granola", "Bolognese"], "Tuesday"], ["04 / 05 / 2022", ["Omlettes", "Fish/chips"], "Wednesday"], ["05 / 05 / 2022", ["Granola", "Daal"], "Thursday"]];

  recipe_names = this.storage.getRecipeNames();
}
