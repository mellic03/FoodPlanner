import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { StorageService } from './services/storage.service';
import { PhotoService } from './services/photo.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { LoginmodalPage } from './loginmodal/loginmodal.page'
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [Storage]
})
export class AppComponent {

  public appPages = [
    { title: 'Shopping List', url: '/shopping-list', icon: 'list' },
    { title: 'Recipes', url: '/recipes', icon: 'restaurant' },
    { title: 'Planner', url: '/planner', icon: 'calendar' },
    { title: 'Statistics', url: '/statistics', icon: 'stats-chart' },
    { title: 'Settings', url: '/settings', icon: 'settings' },
  ];

  constructor(public router:Router, private modalController:ModalController, public menuController:MenuController, private storage:StorageService, public photoService:PhotoService, public alertController: AlertController) {
    this.initializeApp();
  }

  async initializeApp() {

    // Check if the user is logged in. If null, then the app hasn't been used before.
    if (await this.storage.get("user_logged_in") == null) {

      // If the app hasn't been used yet, set the theme to light_theme
      this.current_theme = "light_theme"; // Immediately changes app.component.html class to "light_theme"
      this.storage.set("current_theme", "light_theme"); // Store in persistent storage

      // POPULATE DATA FOR TESTING PURPOSES. YOU MUST REMOVE THIS
      this.storage.populateData();
      
      this.presentModal(); // Present modal with logged_in = undefined
    }


    // If the app has been used but the user isn't logged in.
    else if (await this.storage.get("user_logged_in") == false) {
      this.current_theme = (await this.storage.get("current_theme")); // Set the theme to the stored theme.
      this.presentModal(false); // Present modal with logged_in = false
    }


    // If the user is logged in.
    else if (await this.storage.get("user_logged_in") == true) {
      this.user_logged_in = true;
      this.current_theme = (await this.storage.get("current_theme")); // Set the theme to the stored theme.
      this.photoService.loadSaved(); // Load the stored profile picture.
    }
  }

  // Presents the login screen.
  async presentModal(logged_in:boolean = undefined) {
    const modal = await this.modalController.create({
      component: LoginmodalPage,
      componentProps: {logged_in: logged_in}
    });

    // Modal returns the current username when dismissed.
    modal.onDidDismiss().then((data) => {

      this.current_user = data.data; // Set current_user to currently logged in user
      this.user_logged_in = true;
      this.storage.set("user_logged_in", true);
    });
    
    return (modal.present());
  }

  // Confirmation popup before logging out. Sets user_logged_ion to false on confirmation.
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      message: 'Log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: () => {
          }
        }, {
          text: 'Log out',
          id: 'confirm-button',
          handler: () => {
            this.menuController.close();
            this.user_logged_in = false;
            this.storage.set("user_logged_in", false);
            this.presentModal(false);
          }
        }
      ]
    });

    await alert.present();
  }

  // Set theme to theme_name
  async setTheme(theme_name:string) {
    this.current_theme = theme_name;
    await this.storage.set("current_theme", theme_name);
  }

  current_user:string; // Username of currently logged-in user.
  user_logged_in:boolean = false; // Boolean representing whether a user is currently logged in.
  current_theme:string; // The current theme.
}
