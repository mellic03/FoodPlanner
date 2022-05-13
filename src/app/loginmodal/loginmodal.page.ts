import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-loginmodal',
  templateUrl: './loginmodal.page.html',
  styleUrls: ['./loginmodal.page.scss'],
})
export class LoginmodalPage implements OnInit {

  constructor(private navParams:NavParams, private modalController:ModalController, private storage:StorageService) { }

  async ngOnInit() {
    
    if (await this.storage.get("user_array") == undefined) {
      this.storage.set("user_array", []);
      this.user_array = [];
    }
    else if (await this.storage.get("user_array") != undefined) {
      this.user_array = await this.storage.get("user_array");
    }

    if (await this.navParams.get("logged_in") == undefined) {
      // First-time login screen
    }
    else if (await this.navParams.get("logged_in") == false) {
      // Normal login screen
    }
  }

  // If username/password is valid, dismisses modal passsing username to AppComponent through NavParams.
  login(name:string, pass:string) {

    // Check user_array for this user
    for (let user of this.user_array) {
      if (user[0] == name && user[1] == pass) {
        this.modalController.dismiss(name);
      }
    }
    this.attempt_count += 1;
    this.error_message = "This user does not exist " + "x" + this.attempt_count;
  }

  // Push a new user to user_array in storage.
  async createUser(name:string, pass:string, pass_confirm:string) {

    let fields_full:boolean = (name != undefined && pass != undefined && pass_confirm != undefined);
    let passwords_match:boolean = (pass == pass_confirm);

    if (fields_full && passwords_match) {
      console.log(this.user_array);
      this.user_array.push([name, pass]);
      this.storage.set("user_array", this.user_array);
      this.modalController.dismiss(name);
    }
    
    else if (!fields_full) {
      this.error_message = "Please enter a username and password.";
    }
    
    else if (fields_full && !passwords_match) {
      this.error_message = "Passwords don't match.";
    }
  }


  user_array:Array<Array<string>>; // An array of all users in the form [ [username, password], [username, password], ... ]
  error_message:string;
  attempt_count:number = 0;

  logged_in:boolean;
  username:string;
  password:string;

  new_username:string;
  new_password:string;
  new_password_confirmation:string;
}
