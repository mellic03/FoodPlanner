import { Component, enableProdMode, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginmodalPage } from './loginmodal/loginmodal.page'
import { ModalController } from '@ionic/angular';
import { StorageService } from './services/storage.service';
import { PhotoService } from './services/photo.service';
import { RecipeService } from './services/recipe.service';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [Storage]
})

export class AppComponent implements OnInit {
  
  public appPages = [
    { title: 'Shopping List', url: '/shopping-list', icon: 'list' },
    { title: 'Recipes', url: '/recipes', icon: 'restaurant' },
    { title: 'Planner', url: '/planner', icon: 'calendar' },
    { title: 'Statistics', url: '/statistics', icon: 'stats-chart' },
    { title: 'Settings', url: '/settings', icon: 'settings' },
  ];

  constructor(
    private recipeService:RecipeService,
    public router:Router,
    private modalController:ModalController,
    private menuController:MenuController,
    private storage:StorageService,
    public photoService:PhotoService,
    public alertController: AlertController,
    private platform:Platform
  ) { }

  ngOnInit() {
    //enableProdMode();
    this.initializeApp();
  }

  async initializeApp() {
    
    // Get user_logged_in boolean.
    let user_logged_in:boolean = await this.storage.get("user_logged_in");
    let current_theme:string = await this.storage.get("current_theme");
    let current_user:string = await this.storage.get("current_user");

    // If user_logged_in doesn't exist, run setup code.
    if (user_logged_in == null) {

      this.recipeService.populateData(); // POPULATE DATA FOR TESTING PURPOSES. YOU MUST REMOVE THIS

      // Set default values
      this.current_theme = "light_theme";
      this.storage.set("current_theme", "light_theme");

      this.presentModal(); // Present modal with logged_in = undefined
    }

    // If the app has been used before.
    else {
      this.current_theme = current_theme; // Set the theme to the stored theme.

      // If the user is logged in.
      if (user_logged_in == true) {
        this.user_logged_in = true;
        this.current_user = current_user;
        this.photoService.loadSaved(); // Load the stored profile picture.
      }

      // If the user is not logged in.
      else if (user_logged_in == false) {
        this.presentModal(false); // Present modal with logged_in = false
      }
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
      this.storage.set("current_user", data.data);
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

  navToPage(page_url:string) {
    this.router.navigateByUrl(page_url);
  }


  // Set theme to theme_name
  async setTheme(theme_name:string) {
    this.current_theme = theme_name;
    await this.storage.set("current_theme", theme_name);
  }

  current_user:string; // Username of currently logged-in user.
  user_logged_in:boolean = false; // Boolean representing whether a user is currently logged in.
  current_theme:string; // The current theme.

  selected_item:object;
}
