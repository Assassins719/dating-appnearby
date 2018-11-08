import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { Rating } from '../../model/rating.model';
import { User } from '../../model/user.model';

@IonicPage()
@Component({
  selector: 'page-rating-details',
  templateUrl: 'rating-details.html',
})
export class RatingDetails implements OnInit, OnDestroy {
  ownerUID: string;
  fromUserUID: string;
  owner: User = new User();
  fromUser: User = new User();
  ratingDetails: Rating;
  isOwner: boolean = false;
  unSubscriptionList: any[] = [];
  reportMessage: string;
  isReportedEarlier: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService
  ) {
    if (navParams.data && navParams.data.ownerUID && navParams.data.fromUserUID) {
      this.ownerUID = navParams.data.ownerUID;
      this.fromUserUID = navParams.data.fromUserUID;
      this.isOwner = (this.ownerUID === this.userService.getOwnerId());
      this.userService.getReportUser(this.fromUserUID,(data)=>{
        if(data){
          this.isReportedEarlier = true;
        }
      });
    }
  }

  ngOnInit() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    let sub = this.userService.getUser(this.ownerUID).subscribe(snap => this.owner = snap);
    this.unSubscriptionList.push(sub);
    sub = this.userService.getUser(this.fromUserUID).subscribe(snap => this.fromUser = snap);
    this.unSubscriptionList.push(sub);
    sub = this.userService.getRating(this.fromUserUID, this.ownerUID).subscribe(
      snap => {
        console.log(snap);
        this.ratingDetails = snap;
        loader.dismiss();
      }
    );
    this.unSubscriptionList.push(sub);
  }

  ngOnDestroy() {
    if (this.unSubscriptionList.length) {
      this.unSubscriptionList.map(sub => sub.unsubscribe());
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingDetails');
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Report to Admin',
      subTitle: 'Are you sure you want to report this rating to Admin?',
      inputs: [{
        name: 'comment',
        placeholder: 'Comments here...'
      }],
      buttons: [{
        text: 'OK',
        handler: data => {
          if (data.comment) {
            this.reportMessage = 'The rating details has been successfully reported to the Admin.';
            this.userService.addReportUser(this.fromUserUID,data.comment);
          }
        }
      }, {
        text: 'Cancel',
        handler: () => {
        }
      }]
    });
    alert.present();
  }

}
