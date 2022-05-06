import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {

  constructor(private storage:StorageService) { }

  ngOnInit() {
    // loads the stored recipes
    this.storage.get("persistent_recipes").then( val => {
      this.persistent_recipes = val;
      this.shopping_list = this.storage.getAllInfo(val);
    });
  }

  // Marks an ingredient as "checked".
  checkIngredient(index:number, newValue:boolean) {
    let ingredient_name = this.shopping_list[index][0];
    this.storage.checkIngredient(ingredient_name, newValue);
  }

  persistent_recipes;
  shopping_list = [];
}
