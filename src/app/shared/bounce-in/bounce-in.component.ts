import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { AnimationController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';

@Component({
  selector: 'bounce-in',
  templateUrl: './bounce-in.component.html',
  styleUrls: ['./bounce-in.component.scss'],
})

export class BounceInComponent {

  @ViewChild("fade_in_content", { read: ElementRef, static: true}) fade_in_content: ElementRef;
  @Input() duration:number = 250; // Default animation duration is 350ms.
  @Input() slide_direction:string = "none";

  constructor(private animationController:AnimationController) { }

  ngAfterViewInit() {
    this.playFadeInAnimation();
  }

  playFadeInAnimation() {

    let slide_animation;

    if (this.slide_direction == "left") {
      slide_animation = this.animationController.create()
      .addElement(this.fade_in_content.nativeElement)
      .keyframes([
        { offset: 0, transform: 'translateX(150vh)'},
        { offset: 1, transform: 'translateX(0vh)'},
      ])
    }

    else if (this.slide_direction == "right") {
      slide_animation = this.animationController.create()
      .addElement(this.fade_in_content.nativeElement)
      .keyframes([
        { offset: 0, transform: 'translateX(-150vh)'},
        { offset: 1, transform: 'translateX(0vh)'},
      ])
    }

    else if (this.slide_direction == "top") {
      slide_animation = this.animationController.create()
      .addElement(this.fade_in_content.nativeElement)
      .keyframes([
        { offset: 0, transform: 'translateY(150vh)'},
        { offset: 1, transform: 'translateY(0vh)'},
      ])
    }

    else if (this.slide_direction == "bottom") {
      slide_animation = this.animationController.create()
      .addElement(this.fade_in_content.nativeElement)
      .keyframes([
        { offset: 0, transform: 'translateY(-150vh)'},
        { offset: 1, transform: 'translateY(0vh)'},
      ])
    }
    
    else {
      slide_animation = this.animationController.create()
    }

    const fade_in_animation = this.animationController.create()
    .addElement(this.fade_in_content.nativeElement)
    .keyframes([
      { offset: 0, transform: 'scale(0)', opacity: 0},
      { offset: 0.9, transform: 'scale(110%)', opacity: 1},
      { offset: 1, transform: 'scale(100%)', opacity: 1},
    ])

    const root_animation = this.animationController.create()
    .addElement(this.fade_in_content.nativeElement)
    .easing('ease-out')
    .duration(this.duration)
    .addAnimation([fade_in_animation, slide_animation])
    
    root_animation.play();
  }

}
