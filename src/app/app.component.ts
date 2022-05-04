import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { menuController } from '@ionic/core';
import { StorageService } from './services/storage.service';
import { PhotoService } from './services/photo.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

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

  constructor(public router:Router, public menuController:MenuController, private storage:StorageService, public photoService:PhotoService, public alertController: AlertController) {
    
    // Retrieves theme preference from storage and sets this.current_theme accordingly.
    this.storage.get("current_theme").then( val => {
      // First, check if the theme has been set
      if (val != undefined) {
        this.current_theme = val;
      }
      // If not, default to light theme.
      else {
        this.current_theme = "light_theme";
      }
    });

    this.storage.get("user_logged_in").then( val => {
      this.user_logged_in = val;
    })

    // Load the stored profile picture.
    this.photoService.loadSaved();
  }

  // Confirmation popup before logging out
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      message: 'Log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
          }
        }, {
          text: 'Log out',
          id: 'confirm-button',
          handler: () => {
            this.menuController.close();
            this.user_logged_in = false;
            this.router.navigateByUrl("/login");
          }
        }
      ]
    });

    await alert.present();
  }

  setTheme(theme_name:string) {
    this.current_theme = theme_name;
    this.storage.set("current_theme", theme_name);
  }

  current_user:string = "Michael Ellicott";
  public user_logged_in:boolean = false;

  current_theme:string;
  
}
