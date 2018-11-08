import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { Rating } from '../../model/rating.model';

@IonicPage()
@Component({
  selector: 'page-profile-rating',
  templateUrl: 'profile-rating.html',
})
export class ProfileRating {

	ratingObj:Rating;
  toUserUid:string;
  sub:any;
  readOnly:boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public userService: UserService
    ) {
    if(navParams.data && navParams.data.toUserUid){
      this.toUserUid = navParams.data.toUserUid;
      this.ratingObj = new Rating();
      this.sub = this.userService.getRating(this.userService.getOwnerId(),this.toUserUid).subscribe(
        val =>{
          console.log(val);
          if(val.$exists()){
            this.ratingObj = val;
            this.readOnly = true;
          } else {
            this.ratingObj = new Rating();
          }
          this.sub.unsubscribe();
        }
      );
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileRating');
  }

  submitRating(){

    let confirm = this.alertCtrl.create({
      title: 'Warning',
      message: 'Are you sure you are finished with the rating?',
      buttons: [{
        text: 'No',
      }, {
        text: 'Yes',
        handler: () => {
          this.ratingObj.ratingDate = Date.now();
          this.userService.setRating(this.toUserUid,this.ratingObj);
          this.navCtrl.pop();
        }
      }]
    });
    confirm.present();



  
  }

}