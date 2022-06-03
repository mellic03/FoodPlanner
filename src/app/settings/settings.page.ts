import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { StorageService } from '../services/storage.service';
import { AlertController, AnimationController } from '@ionic/angular';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {

  constructor(
    private recipeService:RecipeService,
    public photoService:PhotoService,
    private appComponent:AppComponent,
    private storage:StorageService,
    public alertController: AlertController) {

  }

  async ngOnInit() {
    // Get theme info from storage.
    this.current_theme = await this.storage.get("current_theme");
    // Get current username from storage.
    this.current_user = await this.storage.get("current_user");

    this.finished_loading = true;
  }

  // Confirmation popup before deleting all recipe data
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'This will <strong>delete all recipes</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Cancelled');
          }
        }, {
          text: 'Delete',
          id: 'confirm-button',
          handler: () => {
            this.storage.set("all_recipes", []);
            this.storage.set("shopping_list", []);
            console.log("Deleted");
          }
        }
      ]
    });

    await alert.present();
  }

  // Take photo from camera or select from filesystem.
  take_photo() {
    this.photoService.takePicture();
  }

  // Sets the theme to theme_name
  async setTheme(theme_name:string) {
    /*
    if (this.current_theme == "light_theme") {
      const animation1 = this.animationCtrl.create()
      .addElement(document.querySelectorAll(".content"))
      .duration(150)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'translateX(0px)'},
        { offset: 1, transform: 'translateX(100vw)'},
      ])
  
      const animation2 = this.animationCtrl.create()
      .addElement(document.querySelectorAll(".content"))
      .duration(150)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'translateX(-100vw)'},
        { offset: 1, transform: 'translateX(0px)'},
      ])
  
      await animation1.play();
  
      this.current_theme = theme_name;
      this.appComponent.setTheme(theme_name);
  
      animation2.play();
    }

    else if (this.current_theme == "dark_theme") {
      const animation1 = this.animationCtrl.create()
      .addElement(document.querySelectorAll(".content"))
      .duration(150)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'translateX(0px)'},
        { offset: 1, transform: 'translateX(-100vw)'},
      ])
  
      const animation2 = this.animationCtrl.create()
      .addElement(document.querySelectorAll(".content"))
      .duration(150)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'translateX(100vw)'},
        { offset: 1, transform: 'translateX(0px)'},
      ])
  
      await animation1.play();
  
      this.current_theme = theme_name;
      this.appComponent.setTheme(theme_name);
  
      animation2.play();
    }
    */
    this.current_theme = theme_name;
    this.appComponent.setTheme(theme_name);
  }

  // Populates recipes object. Exists for testing purposes.
  async populateData() {
    await this.recipeService.populateData();
  }
  
  // Change the username of the currently logged in user.
  async changeCredentials(new_username) {
    let user_array = await this.storage.get("user_array");
    let current_user = await this.storage.get("current_user");

    for (let user of user_array) {
      if (user[0] == current_user) {
        user[0] = new_username;
        current_user = new_username;

        this.appComponent.current_user = new_username;
        await this.storage.set("user_array", user_array);
        await this.storage.set("current_user", current_user);
      }
    }

  }


  current_user:string;

  current_theme:string; // String to display on settings page for active theme.
  dark_theme_on:boolean; // Boolean used with the theme toggle.

  profile_picture: UserPhoto;

  finished_loading:boolean = false;
}