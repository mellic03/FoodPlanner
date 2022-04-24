import { Component } from '@angular/core';

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

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor() {}

  current_theme = 'light_theme';

  toggleTheme() {
    if (this.current_theme == 'light_theme') {
      this.current_theme = 'dark_theme';
    }
    else if (this.current_theme == 'dark_theme') {
      this.current_theme = 'light_theme';
    }
  }

}
