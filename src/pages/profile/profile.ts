import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PictureSlider } from '../../pages/picture-slider/picture-slider';
import { UserService } from '../../providers/user-service';
import { User } from '../../model/user.model';
import { AppService } from '../../providers/app-service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile implements OnInit, OnDestroy {

  private is_fav: Boolean;
  private is_meet: Boolean;
  private is_owner: Boolean = false;
  private is_from_footer: Boolean;
  private is_block: Boolean;
  private is_report; Boolean;
  pageTitle: string;
  pageName: String;
  user: User;
  uid: string;
  sub: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public userService: UserService,
    public appService: AppService
  ) {
    this.pageTitle = "Profile";
    this.pageName = "Profile";

    if (this.navParams.data && this.navParams.data.is_owner) {
      this.is_owner = this.navParams.data.is_owner;
      this.is_from_footer = this.navParams.data.from_footer
      this.pageTitle = "My Profile";
      this.userService.getUser(this.userService.getOwnerId()).subscribe(
        value => this.user = value
      );
    } else {
      if (this.navParams.data.uid) {
        this.uid = this.navParams.data.uid;
        this.userService.getUser(this.uid).subscribe(
          value => this.user = value
        );
        this.userService.getFavorite(this.uid).subscribe(
          val => this.is_fav = val.$value
        );
        this.userService.getWemet(this.uid).subscribe(
          val => this.is_meet = val.$value
        );
        this.userService.setViewedMe(this.uid);

        this.userService.getBlockedUserRef(this.uid,(data)=>{
          this.is_block = data;
        });
      }
    }
    if (!this.is_from_footer) {
      this.appService.setRoute(false);
    }
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.appService.setRoute(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Profile');
  }

  navigateToSettings() {
    this.navCtrl.push('Settings');
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: 'Click on we met before you rate.',
      buttons: ['Dismiss']
    });
    alert.present();
  }


  navigateToProfileRating() {
    if (this.is_meet) {
      this.userService.checkWemet(this.uid, flag => {
        if (flag) {
          this.navCtrl.push('ProfileRating', {
            is_owner: this.is_owner,
            toUserUid: this.uid
          });
        } else {
          let alert = this.alertCtrl.create({
            title: 'Alert',
            subTitle: 'Your partner has not Met you.',
            buttons: ['Dismiss']
          });
          alert.present();
        }
      });
    } else {
      //this.navCtrl.push('RatingList');
      this.presentAlert();
    }
  }

  navigateToRatingList() {
    console.log('this.is_owner', this.is_owner);
    this.navCtrl.push('RatingList', {
      is_owner: this.is_owner,
      toUserUid: this.uid
    });
  }

  toggelFav() {
    this.is_fav = !this.is_fav;
    this.userService.setFavorite(this.uid, this.is_fav);
  }

  toggelMeet() {
    this.is_meet = !this.is_meet;
    this.userService.setWemet(this.uid, this.is_meet);
  }

  toggelBlock() {
    let str = (this.is_block === true) ? 'Unblock' : 'Block';
    let message = 'Do you want to ' + str + ' the profile?';
    let title = str + ' Profile?';
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Cancel',
      }, {
        text: 'Yes',
        handler: () => {
          this.is_block = !this.is_block;
          this.userService.setBlockedUser(this.uid, this.is_block);
        }
      }]
    });
    confirm.present();
  }

//Added to report users

  toggleReport() {
    let str = (this.is_report === true) ? 'Stop Reporting' : 'Report';
    let message = 'Do you want to ' + str + ' the profile/pics?';
    let title = str + ' Profile/Pics?';
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Cancel',
      }, {
        text: 'Yes',
        handler: () => {

          this.is_report = !this.is_report;
          

        }
      }]
    });
    confirm.present();
  }





  navigateToChat() {
    this.navCtrl.push('ChatDetails', {
      toUserUid: this.uid
    });
  }

  navigateToEdit() {
    this.navCtrl.push('EditProfile');
  }

  imageSlider() {
    if (this.user.profilePicPath) {
      let modal = this.modalCtrl.create(PictureSlider, { "user": this.user });
      modal.present();
    }
  }

}
