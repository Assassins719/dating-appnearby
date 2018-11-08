import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams , Slides} from 'ionic-angular';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})

export class Intro {

  @ViewChild(Slides) slides: Slides;

  title="Using Date$";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Intro');
  }

  goToSlide(index) {
    if(index>4)
    {
       this.navCtrl.push(LoginPage);
    }else
    {
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
