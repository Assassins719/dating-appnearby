import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';
// import { LoginPage } from '../login/login';
import { AuthService } from '../../providers/auth-service';
import { UserService } from '../../providers/user-service';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class Signup {
  users: FirebaseListObservable<any[]>;
  error: any;
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public userService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    // console.log(this.users);   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible'
    });
  }

  onSubmit(formData) {
    
    let self = this;
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });

    if(formData.value.terms){
      loader.present();
      this.userService.isPhoneExist(formData.value.phone, function (listData) {
        if (listData.length > 0) {
          self.error = "Phone no already exist.";
          loader.dismiss();
        } else if (formData.value.password !== formData.value.repassword) {
          self.error = "Password should match while re-entering.";
          loader.dismiss();
        } else if (formData.valid) {
          self.authService.singup(
            formData.value,
            (success) => {
              self.authService.sendSms(formData.value.phone, '+91', self.authService.genRand(),
                function (successSms) {
                  loader.dismiss();
                  //self.navCtrl.setRoot('Verification');
                }, function (errorSMS) {
                  loader.dismiss();
                });
            },
            (err) => {
              loader.dismiss();
              self.error = err;
            }
          );
        }
      });
    }else{
      self.error = "Please accept terms & conditionss";
    }

    
  }

  open(){
    window.open('http://dates.money/eula', '_system');
  }

}