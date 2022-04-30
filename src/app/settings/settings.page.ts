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
    this.storage.get("current_theme").then( val => {
      this.current_theme = val;
    });
  }

  ngOnInit() {
  }

  setTheme(theme_name:string) {
    this.current_theme = theme_name;
    this.appComponent.setTheme(theme_name);
  }

  clearData() {
    this.storage.set("persistent_recipes", []);
  }

  populateData() {
    this.storage.set("persistent_recipes", [
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
            "unit": "jar"
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
            "quantity": 4,
            "unit": "unit"
          },
          {
            "name": "cheese",
            "quantity": 1,
            "unit": "cup"
          }
        ]
      }
    ]);
  }

  current_theme:string; // String to display on settings page for active theme.
  dark_theme_on:boolean; // Boolean used with the theme toggle.
}
