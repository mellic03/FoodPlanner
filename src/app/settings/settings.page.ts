import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private appComponent:AppComponent, private storage:StorageService) { }

  ngOnInit() {
  }

  current_theme:string = 'Light theme';

  toggleTheme() {
    this.appComponent.toggleTheme();
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
}
