import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private appComponent:AppComponent, private storage:StorageService) {
    // Get theme info from storage.
    this.storage.get("dark_theme_on").then( val => {
      this.dark_theme_on = val;
    });

    if (this.dark_theme_on) {
      this.current_theme = 'Dark theme'; 
    }
    else if (!this.dark_theme_on) {
      this.current_theme = 'Light theme';
    }
  }

  ngOnInit() {
  }
  
  toggleTheme() {
    // Switch theme in appComponent so the change applies immediately.
    this.appComponent.toggleTheme();

    // Change this.current_theme and update storage.
    if (this.current_theme == 'Light theme') {
      this.current_theme = 'Dark theme';
    }
    else if (this.current_theme == 'Dark theme') {
      this.current_theme = 'Light theme';
    }
  }

  clearData() {
    this.storage.set("recipes_uncooked", []);
    this.storage.set("recipes_cooked", []);
  }

  populateData() {
    this.storage.set("recipes_uncooked", [
      {
        "name": "Bolognese",
        "ingredients": [
          {
            "name": "mince",
            "quantity": 250,
            "unit": "gram"
          },
          {
            "name": "pasta",
            "quantity": 100,
            "unit": "gram"
          },
          {
            "name": "pasta sauce",
            "quantity": 1,
            "unit": "gram"
          }
        ]
      },
      {
        "name": "Burgers",
        "ingredients": [
          {
            "name": "mince",
            "quantity": 500,
            "unit": "gram"
          },
          {
            "name": "buns",
            "quantity": 100,
            "unit": "gram"
          },
          {
            "name": "cheese",
            "quantity": 100,
            "unit": "gram"
          }
        ]
      }
    ]);
  }

  current_theme:string; // String to display on settings page for active theme.
  dark_theme_on:boolean; // Boolean used with the theme toggle.
}
