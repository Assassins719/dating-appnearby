import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { AuthService } from '../../providers/auth-service';
import { User } from '../../model/user.model';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class Settings {
  pageTitle: string;
  user: User = new User();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public authService: AuthService,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.pageTitle = "Settings";
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.userService.ownerChangedRef().once('value').then(
      snap => {
        this.user = snap.val();
        loader.dismiss();
      }
    );
  }

  setAll(flag) {
    this.user.hideOnlineStatus = flag;
    this.user.hideViewSomeone = flag;
    this.user.hideFevSomeone = flag;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Settings');
  }

  changePassword(email) {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    let toast = this.toastCtrl.create({
      message: 'We have sent you a password reset email in your register email id. ',
      duration: 3000,
      position: 'top'
    });
    loader.present();
    this.authService.forgetPassword(email).then(function () {
      loader.dismiss();
      toast.present();
    });
  }

  updateSetting() {
    this.userService.updateOwner(this.user);
    this.navCtrl.setRoot('SearchResult');
  }

  changeEmail(email){
    let self=this;
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.authService.updateEmail(email).then(function(){
      self.user.email=email;
      self.userService.updateOwnerWithPromise(self.user).then(function(){
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Your email ID has been changed successfully. Please log out and login again.',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }).catch(function(){
        loader.dismiss();
      })
    }).catch(function(){
      loader.dismiss();
    });

  }

}
