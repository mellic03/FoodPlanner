import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { StorageService } from '../services/storage.service';
import { AlertController } from '@ionic/angular';
import { PhotoService, UserPhoto } from '../services/photo.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {

  constructor(public photoService:PhotoService, private appComponent:AppComponent, private storage:StorageService, public alertController: AlertController) {
    // Get theme info from storage.
    this.storage.get("current_theme").then( val => {
      this.current_theme = val;
    });
  }

  ngOnInit() { }

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
            console.log("Deleted")
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
  setTheme(theme_name:string) {
    this.current_theme = theme_name;
    this.appComponent.setTheme(theme_name);
  }

  // Populates recipes object. Exists for testing purposes.
  async populateData() {
    await this.storage.populateData();
  }

  current_theme:string; // String to display on settings page for active theme.
  dark_theme_on:boolean; // Boolean used with the theme toggle.

  profile_picture: UserPhoto;
}
