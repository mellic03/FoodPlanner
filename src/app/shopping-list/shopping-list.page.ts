import { Component, OnInit } from '@angular/core';
import { RecipeService, Ingredient, Recipe  } from '../services/recipe.service';
import { RecipeModalPage } from '../recipe-modal/recipe-modal.page';
import { ModalController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})

export class ShoppingListPage implements OnInit {
  
  constructor(private recipeService:RecipeService, private modalController:ModalController, private storage:StorageService) { }

  async ngOnInit() {


    this.shopping_list = await this.recipeService.generateShoppingList();
    this.finished_loading = true;
  }

  // Marks an ingredient as "checked".
  checkIngredient(index:number, new_value:boolean) {
    this.recipeService.checkIngredient(this.shopping_list[index].name, new_value);
    this.shopping_list = this.recipeService.sortByCheckedAndAlphabetically(this.shopping_list);
  }

  // Presents the add/edit recipe modal. If editing the index i of a recipe is passed and editing is set to true.
  async presentModal() {
    const modal = await this.modalController.create({
      component: RecipeModalPage,
      // Passes the index of the object being edited.
      componentProps: {}
    });

    modal.onDidDismiss().then((data) => {
      // Add returned recipe to recipe array
      if (data.data != undefined) {

        if (data.data.editing) {
          this.all_recipes[data.data.index] = data.data.recipe;
        }
        else {
          this.all_recipes.push(data.data.recipe);
        }
        this.storage.set("all_recipes", this.all_recipes);
      }
    })
    .then(() => {
      this.recipeService.generateShoppingList();
    })
    
    return (modal.present());
  }

  all_recipes:Array<Recipe> = [];
  shopping_list:Array<Ingredient> = [];

  finished_loading:boolean = false;
}
