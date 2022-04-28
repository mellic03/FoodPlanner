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
    this.storage.get("recipes_uncooked").then( val => {
      this.shopping_list = this.storage.getNamesQuantities(val);
    });
  }

  ionViewWillLeave() {
    this.shopping_list = [];
  }

  shopping_list = [];
}
