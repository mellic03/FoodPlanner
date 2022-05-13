import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {

  constructor(private storage:StorageService) { }

  async ngOnInit() {
    // loads the stored recipes
    this.persistent_recipes = await this.storage.get("all_recipes");

    this.shopping_list = this.storage.getAllInfo(this.persistent_recipes);
    // Sort shopping list into alphabetical and checked order with alphabetical being priority
    this.shopping_list = this.sortListChecked(this.sortListAlphabet(this.shopping_list));
  }

  // Marks an ingredient as "checked".
  checkIngredient(index:number, newValue:boolean) {
    let ingredient_name = this.shopping_list[index][0];
    this.storage.checkIngredient(ingredient_name, newValue);
    this.shopping_list = this.sortListChecked(this.sortListAlphabet(this.shopping_list));
  }

  // Return a shopping list in 1. alphabetical order and 2. checked order.
  sortListAlphabet(shopping_list:Array<Array<any>>) {
    let sorted_shopping_list = shopping_list;
    // Sort alphabetically.
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

  sortListChecked(shopping_list:Array<Array<any>>) {
    let sorted_shopping_list = shopping_list;
    // Sort from unchecked to checked
    for (let i = 0; i < sorted_shopping_list.length-1; i++) {
      for (let j = 0; j < sorted_shopping_list.length-1; j++) {
        if (sorted_shopping_list[j][3] == true && sorted_shopping_list[j+1][3] == false) {
          let temp_obj:Array<any> = sorted_shopping_list[j];
          sorted_shopping_list[j] = sorted_shopping_list[j+1];
          sorted_shopping_list[j+1] = temp_obj;
        }
      }
    }
    return(sorted_shopping_list);
  }


  persistent_recipes;
  shopping_list:Array<Array<any>> = [];

}
