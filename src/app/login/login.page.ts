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
  }

  login(user:string, passwd:string) {

    if (user == "Michael" && passwd == "pass") {
      this.appComponent.user_logged_in = true;
      this.router.navigateByUrl("/shopping-list")
      this.storage.set("user_logged_in", true);
    }
  }

  username:string;
  password:string;
}
