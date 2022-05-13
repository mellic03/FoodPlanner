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
      this.shopping_list = this.sortShoppingList(this.storage.getAllInfo(val));
    });
  }

  // Marks an ingredient as "checked".
  checkIngredient(index:number, newValue:boolean) {
    let ingredient_name = this.shopping_list[index][0];
    this.storage.checkIngredient(ingredient_name, newValue);
  }

  // Return a shopping list in alphabetical order
  sortShoppingList(shopping_list:Array<Array<any>>) {
    let sorted_shopping_list = shopping_list;
    for (let i = 0; i < sorted_shopping_list.length-1; i++) {
      for (let j = 0; j < sorted_shopping_list.length-1; j++) {
        if (sorted_shopping_list[j][0].substring(0, 1) > sorted_shopping_list[j+1][0].substring(0, 1)) {
          let temp_obj:Array<any> = sorted_shopping_list[j];
          sorted_shopping_list[j] = sorted_shopping_list[j+1];
          sorted_shopping_list[j+1] = temp_obj;
        }
      }
    }
    return(sorted_shopping_list);
  }

  persistent_recipes;
  shopping_list = [];

  // Two shopping lists,
}
