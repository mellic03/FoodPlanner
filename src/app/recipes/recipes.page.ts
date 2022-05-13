import { Component, OnInit } from '@angular/core';
import { RecipeModalPage } from '../recipe-modal/recipe-modal.page';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
  providers: [StorageService]
})
export class RecipesPage implements OnInit {

  constructor(private modalController:ModalController, platform:Platform, private storage:StorageService) {}

  async ngOnInit() {
    // load the stored recipes
    this.all_recipes = await this.storage.get("all_recipes");
    console.log(this.all_recipes)
  }

  ngOnDestroy() {
    // Update persistent storage with the local array.
    this.storage.set("all_recipes", this.all_recipes);
  }

  // Presents the add/edit recipe modal. If editing the index i of a recipe is passed and editing is set to true.
  async presentModal(i:number = 0, editing:boolean = false) {
    const modal = await this.modalController.create({
      component: RecipeModalPage,
      // Passes the recipe object at index i, the index i and the editing boolean.
      componentProps: {recipe: this.all_recipes[i], index: i, editing: editing}
    });

    modal.onDidDismiss().then((data) => {
      this.all_recipes = data.data;
      this.storage.set("all_recipes", data.data);
    });
    
    return (modal.present());
  }

  // Remove a recipe from the recipe list.
  deleteRecipe(i:number) {
    // Remove the recipe from the local array
    this.all_recipes.splice(i, 1);
    // Replace the persistent object.
    this.storage.set("all_recipes", this.all_recipes);
  }

  all_recipes:Array<any>; // recipes the user has not marked as "cooked".
}
