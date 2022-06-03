import { Component, OnInit } from '@angular/core';
import { RecipeModalPage } from '../recipe-modal/recipe-modal.page';
import { ModalController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { RecipeService, Recipe, Ingredient, m_Observer } from '../services/recipe.service';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
  providers: [StorageService]
})

export class RecipesPage implements OnInit {
  constructor(
    private modalController:ModalController,
    private recipeService:RecipeService,
    private animationCtrl:AnimationController) {

  }

  async ngOnInit() {
    await this.recipeService.subscribe(this.all_recipes_observer); // Subscribe to all_recipes observable
    this.finished_loading = true;
  }

  // Presents the add/edit recipe modal. If editing the index i of a recipe is passed and editing is set to true.
  async presentModal(recipe:Recipe = undefined, editing:boolean = false, index:number = undefined) {
    const modal = await this.modalController.create({
      component: RecipeModalPage,
      // Passes the index of the object being edited.
      componentProps: {recipe: recipe, editing: editing, index: index}
    });

    modal.onDidDismiss().then(() => {
    });
    return (modal.present());
  }

  // Remove a recipe from the recipe list.
  async deleteRecipe(i:number) {

    const animation = this.animationCtrl.create()
    .addElement(document.querySelectorAll(`.item_${i}`))
    .duration(200)
    .iterations(1)
    .keyframes([
      { offset: 0, transform: 'scale(100%)'},
      { offset: 0.5, transform: 'scale(110%)'},
      { offset: 1, transform: 'scale(0%)'},
    ])
    .easing('ease-in')

    await animation.play();

    this.all_recipes_observer.data.splice(i, 1); // Remove the recipe from the local recipe array
    this.recipeService.setRecipes(this.all_recipes_observer.data); // Replace recipes in storage with the local recipe array.
  }

  all_recipes_observer:m_Observer = new m_Observer();

  all_recipes:Array<Recipe>; // Array of all recipe objects.

  finished_loading:boolean = false;
}