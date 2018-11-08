import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { Rating } from '../../model/rating.model';
import { User } from '../../model/user.model';

@IonicPage()
@Component({
  selector: 'page-rating-list',
  templateUrl: 'rating-list.html',
})
export class RatingList implements OnInit, OnDestroy {
  userID: string;
  user: User;
  ratingList: Rating[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public loadingCtrl: LoadingController
  ) {
    if (navParams.data && navParams.data.is_owner) {
      this.userID = this.userService.getOwnerId();
    }
    if(navParams.data && navParams.data.toUserUid) {
      this.userID = navParams.data.toUserUid;
    }
  }
  ngOnInit() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.userService.getUserRef(this.userID).once('value').then(snap => {
      this.user = snap.val();
    });
    this.userService.getRatingListRef(this.userID).once('value').then(snapList => {
      let list = snapList.val();
      for(let key in list){
        let obj = list[key];
        this.userService.getUserRef(key).once('value').then(snap => {
          let userData = snap.val();
          obj.userName = userData.userName;
          obj.profilePicPath = userData.profilePicPath;
          obj.$key = key;
        });
        this.ratingList.push(obj);
      }
      loader.dismiss();
    });
  }
  ngOnDestroy() {
    // Destroy
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingList');
  }

  navigateToRatingDetails(fromUID) {
    this.navCtrl.push('RatingDetails', {
      ownerUID: this.userID,
      fromUserUID: fromUID
    });
  }

}