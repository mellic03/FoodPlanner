import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { menuController } from '@ionic/core';
import { StorageService } from './storage.service';

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
    { title: 'Settings', url: '/settings', icon: 'settings' },
    { title: 'Statistics', url: '/statistics', icon: 'stats-chart' },
  ];

  constructor(public menuController:MenuController, private storage:StorageService) {
    // Retrieves theme preference from storage and sets this.current_theme accordingly.
    this.storage.get("current_theme").then( val => {
      this.current_theme = val;
    });
  }

  ngOnInit() {
  }

  toggleTheme() {

    if (this.current_theme == 'light_theme') {
      this.current_theme = 'dark_theme';
      this.storage.set("dark_theme_on", true);
    }
    else if (this.current_theme == 'dark_theme') {
      this.current_theme = 'light_theme';
      this.storage.set("dark_theme_on", false);
    }

    // store current theme in storage
    this.storage.set("current_theme", this.current_theme);
  }

  logout() {
    this.menuController.close();
  }

  current_theme:string;
}
