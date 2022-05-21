import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {


  constructor(public loadingController:LoadingController, private router:Router) { }

  ngOnInit() {
    this.presentLoading().then(() => {
      this.router.navigateByUrl("shopping-list");
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 2000,
      spinner: 'bubbles',
      message: 'Please wait...',
      cssClass: 'my-custom-class'
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

}
