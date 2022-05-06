import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private appComponent:AppComponent, private router:Router, private storage:StorageService) { }

  ngOnInit() {
    // If already logged in, go to shopping list.
    if (this.appComponent.user_logged_in) {
      this.router.navigateByUrl("/shopping-list");
    }
  }

  // If username/password is valid, switches user_logged_in to true and navigates to the shopping list page.
  login(user:string, passwd:string) {

    if (user == "username" && passwd == "password") {
      this.appComponent.user_logged_in = true;
      this.storage.set("user_logged_in", true);
      this.router.navigateByUrl("/shopping-list");
    }
  }

  username:string;
  password:string;
}
