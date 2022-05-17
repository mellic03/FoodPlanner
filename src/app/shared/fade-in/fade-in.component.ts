import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AnimationController, ModalController, ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'fade-in',
  templateUrl: './fade-in.component.html',
  styleUrls: ['./fade-in.component.scss'],
})

export class FadeInComponent {

  @ViewChild("fade_in_content", { read: ElementRef, static: true}) fade_in_content: ElementRef;

  constructor(private animationController:AnimationController) { }

  ngAfterViewInit() {
    this.playFadeInAnimation();
  }

  ionViewWillLeave() {
    this.playFadeOutAnimation();
  }

  playFadeInAnimation() {
    const fade_in_animation = this.animationController.create()
    .addElement(this.fade_in_content.nativeElement)
    .fromTo('opacity', 0, 1);
    
    const slide_in_animation = this.animationController.create()
    .addElement(this.fade_in_content.nativeElement)
    .keyframes([
      { offset: 0, transform: 'translateX(-200vh)' },
      { offset: 1, transform: 'translateX(0vh)'},
    ])

    const root_animation = this.animationController.create()
    .addElement(this.fade_in_content.nativeElement)
    .easing('ease-out')
    .duration(800)
    .addAnimation([fade_in_animation, slide_in_animation]);

    root_animation.play();
  }

  playFadeOutAnimation() {
    const fade_out_animation = this.animationController.create()
    .addElement(this.fade_in_content.nativeElement)
    .fromTo('opacity', 1, 0);
    
    const slide_out_animation = this.animationController.create()
    .addElement(this.fade_in_content.nativeElement)
    .keyframes([
      { offset: 0, transform: 'translateX(0vh)' },
      { offset: 1, transform: 'translateX(200vh)'},
    ])

    const root_animation = this.animationController.create()
    .addElement(this.fade_in_content.nativeElement)
    .easing('ease-out')
    .duration(800)
    .addAnimation([fade_out_animation, slide_out_animation]);

    root_animation.play();
  }

}
