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

  setTheme(theme_name:string) {
    this.current_theme = theme_name;
    this.storage.set("current_theme", theme_name);
  }

  logout() {
    this.menuController.close();
  }

  current_user:string = "Michael Ellicott";

  current_theme:string;
}
