import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat-picture-slider',
  templateUrl: 'chat-picture-slider.html',
})
export class ChatPictureSlider {
  path:string;

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public navParams: NavParams) {
    this.path=this.navParams.data.path;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPictureSlider');
  }
  
  dismiss(){
  	this.viewCtrl.dismiss();
  }

}
