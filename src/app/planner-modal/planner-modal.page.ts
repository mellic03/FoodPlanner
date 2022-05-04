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
  }
  
  closeModal() {
    this.modalController.dismiss();
  }
}
