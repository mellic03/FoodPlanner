import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {

  constructor(private storage:StorageService) {
  }

  ngOnInit() {
    // loads the stored recipes
    this.storage.get("persistent_recipes").then( val => {
      this.shopping_list = this.storage.getNamesQuantitiesUnits(val);
    });
  }

  ionViewWillLeave() {
    this.shopping_list = [];
  }

  foo() {
    
  }

  shopping_list = [];
}
