import { Component , Input} from '@angular/core';
import { ModalController } from 'ionic-angular';
// import { SearchModal } from '../../pages/search-modal/search-modal';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'menu-header',
  templateUrl: 'menu-header.html'
})
export class MenuHeader {
  @Input('pageTitle') pageTitle;
  title: string;
  refineActive:boolean;
  constructor(public modalCtrl: ModalController, public navCtrl: NavController) {
    console.log('Hello MenuHeader Component');
  }
  ngAfterViewInit(){
    this.title=this.pageTitle;
    console.log('after view init ');
  }
  navigateToMessage(){
    this.navCtrl.setRoot('Messages');
  }
  navigateToConnect(){
    this.navCtrl.setRoot('ConnectTab');
  }
}
