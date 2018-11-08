import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , Slides} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-use-app',
  templateUrl: 'use-app.html',
})
export class UseApp {
  pageTitle:String;
  title="Using Date$";
  
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pageTitle="How To Use";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UseApp');
  }

  goToSlide(index) {
    if(index>4) {
      this.slides.slideTo(0, 500);
    } else {
      this.slides.slideTo(index, 500);
    }
       
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
    if(currentIndex==1){
      this.title="Safety and Honesty Rating";

    }else if(currentIndex==2){
      this.title="We Met Button.";

    }else if(currentIndex==3){
      this.title="Give Rating Button.";

    }else if(currentIndex==4){
      this.title="Everything Else.";
      
    }

  }

}
