import { Component, OnInit } from '@angular/core';
import { RecipeModalPage } from '../recipe-modal/recipe-modal.page';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
  providers: [StorageService]
})
export class RecipesPage implements OnInit {

  constructor(private modalController:ModalController, platform:Platform, private storage:StorageService) {}

  ngOnInit() {}

  async presentModal() {
  
    const modal = await this.modalController.create({
      component: RecipeModalPage,
      //componentProps: {username: this.username}
      
    });

    modal.onDidDismiss()
    .then((data) => {
      //this.username = data.data;
      // loads the stored recipes
      this.storage.get("recipes").then( res => {
        if(res === undefined) {return}
        this.persistentRecipes = res;
      }); 
    })
    
    return (modal.present());
  }

  ionViewDidEnter() {
    // loads the stored recipes
    this.storage.get("recipes").then( res => {
      if(res === undefined) {return}
      this.persistentRecipes = res;
    });
  }

  logStorage() {
    console.log(this.persistentRecipes);
  }
  
  persistentRecipes:any;
}
