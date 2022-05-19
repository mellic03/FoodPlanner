import { Component, OnInit } from '@angular/core';
import { RecipeService, Ingredient, Recipe  } from '../services/recipe.service';
import { RecipeModalPage } from '../recipe-modal/recipe-modal.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
})

export class ShoppingListPage implements OnInit {
  
  constructor(private recipeService:RecipeService, private modalController:ModalController) { }

  async ngOnInit() {
    this.all_recipes = await this.recipeService.getRecipes();
    this.all_ingredients = this.recipeService.getAllIngredients(this.all_recipes);
    this.shopping_list = this.recipeService.generateShoppingList(this.all_ingredients);
    this.finished_loading = true;
  }

  // Marks an ingredient as "checked".
  checkIngredient(index:number, new_value:boolean) {
    this.recipeService.checkIngredient(this.shopping_list[index].name, new_value);
    this.shopping_list = this.recipeService.generateShoppingList(this.shopping_list);
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
          this.all_ingredients = this.recipeService.getAllIngredients(this.all_recipes);
          this.shopping_list = this.recipeService.generateShoppingList(this.all_ingredients);
        }
        this.recipeService.setRecipes(this.all_recipes);
      }
    })
    
    return (modal.present());
  }

  all_recipes:Array<Recipe> = [];
  all_ingredients:Array<Ingredient> = [];
  shopping_list:Array<Ingredient> = [];

  finished_loading:boolean = false;
}
