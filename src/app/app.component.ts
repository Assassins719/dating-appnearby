import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, ToastController, AlertController, MenuController, IonicApp } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { FCM } from '@ionic-native/fcm';

import { LoginPage } from '../pages/login/login';
import { Intro } from '../pages/intro/intro';
import { SearchResult } from '../pages/search-result/search-result';
import { Verification } from '../pages/verification/verification';
import { AuthService } from '../providers/auth-service';
import { UserService } from '../providers/user-service';
import { ChatService } from '../providers/chat-service';
import { User } from '../model/user.model';
import { AppService } from '../providers/app-service'


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  firstTime: boolean = false;
  user: User;
  sub: any;
  userSub: any;
  alert: any;
  showSidePanel: boolean = false;

  //side panel variable 
  subcriptionLeftInDays: number;
  dayFactor: number = 24 * 60 * 60 * 1000;
  isPaidMember: boolean;
  trialPeriodInDays: number;
  subscriptionEnable: boolean;
  subscriptionDays: number;
  profileExpire: boolean;

  constructor(
    public platform: Platform,
    public authService: AuthService,
    statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public userService: UserService,
    public storage: Storage,
    public chatService: ChatService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public afAuth: AngularFireAuth,
    public appService: AppService,
    private menuCtrl: MenuController,
    private ionicApp: IonicApp,
    // private fcm: FCM
  ) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);

      platform.registerBackButtonAction(() => {
        // get current active page
        let ready = true;
        let activePortal = ionicApp._loadingPortal.getActive() ||
          ionicApp._modalPortal.getActive() ||
          ionicApp._toastPortal.getActive() ||
          ionicApp._overlayPortal.getActive();

        if (activePortal) {
          ready = false;
          activePortal.dismiss();
          activePortal.onDidDismiss(() => { ready = true; });
          console.log("active any poup ");
          return;
        }

        if (menuCtrl.isOpen()) {
          console.log("close menu")
          menuCtrl.close();
          return;
        }

        let view = this.nav.getActive();
        //let page = view ? this.nav.getActive().instance : null;

        if (this.nav.canGoBack() || view && view.isOverlay) {
          console.log("popping back");
          this.nav.pop();
        } else {
          console.log("in page root ")
          if (this.alert) {
            this.alert.dismiss();
            this.alert = null;
          } else {
            this.showAlert();
          }
        }
      });

    });
  }

  showAlert() {
    this.alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.alert = null;
        }
      }, {
        text: 'Exit',
        handler: () => {
          this.platform.exitApp();
        }
      }]
    });
    this.alert.present();
  }

  showToast() {
    let toast = this.toastCtrl.create({
      message: 'Press Again to exit',
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  ngOnInit() {
    this.appService.setRouteObj$.subscribe(value => {
      if (value) {
        this.showSidePanel = true;
        this.checkProfileComplete();
        this.rootPage = SearchResult;
      } else {
        this.showSidePanel = false;
      }
    });
    //let self=this;
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.authService.loginChanged(auth => {
      // console.log('>>> login changed');
      // console.log(auth);
      if (auth) {
        this.userService.ownerChangedRef().once('value').then((snap) => {
          this.user = snap.val();
          // console.log('Test', this.user);
          if (this.user.is_phone_verified) {
            this.showSidePanel = true;
            // side panel code //////////////////////
            // this.user = snap.val();
            console.log('this.user', this.user);
            this.rootPage = SearchResult;
            // Set Online -- first time
            this.storage.set('first_time', true);
            console.log('online status changed');
            if (!this.user.hideOnlineStatus) {
              this.user.isOnline = true;
            }
            // console  .log(this.user);
            this.userService.updateOwner(this.user);
            this.checkProfileComplete();
          } else {
            console.log("phone not verified");
            this.rootPage = Verification;
          }
          loader.dismiss();
        });
      } else {
        this.storage.get('first_time').then((val) => {
          if (!val) {
            this.rootPage = Intro;
          } else {
            this.rootPage = LoginPage;
          }

        });
        loader.dismiss();
      }
    });

  }

  ngOnDestroy() {
    if (this.authService.isLoginActive()) {
      this.user.isOnline = false;
      this.userService.updateOwner(this.user);
    }
    // this.sub.unsubscribe();
  }

  checkProfileComplete() {
    let now = Date.now();
    this.user.subcriptionLastDate;
    this.subcriptionLeftInDays = Math.ceil((this.user.subcriptionLastDate - now) / this.dayFactor);
    this.user.isPaidMember;

    if (this.subcriptionLeftInDays <= 0 && this.user.isPaidMember) {
      this.subcriptionLeftInDays = 0;
      this.user.isPaidMember = false;
      this.userService.updateOwner(this.user);
    }
    // First time User force to complete the profile
    this.userService.ownerChangedRef().once('value').then((snap) => {
      this.user = snap.val();
      if (!this.user.profileCompleted) {
        let confirm = this.alertCtrl.create({
          title: 'Complete Profile',
          message: 'Please complete your profile to proceed further.',
          buttons: [{
            text: 'Proceed',
            handler: () => {
              this.nav.push('EditProfile');
            }
          }]
        });
        confirm.present();
      } else {
        this.sub = this.userService.ownerChanged().subscribe(
          value => {
            this.user = value;
            console.log('I am listening from app component');
            if (this.user.hideOnlineStatus && this.user.isOnline) {
              this.user.isOnline = false;
              this.userService.updateOwner(this.user);
            }
            if (!this.user.hideOnlineStatus && !this.user.isOnline) {
              this.user.isOnline = true;
              this.userService.updateOwner(this.user);
            }
          },
          console.log,
          () => console.log('finish')
        );
      }
    });
  }

  openPage(page: any) {
    var that = this;
    switch (page) {
      case 'Logout':
        let loader = this.loadingCtrl.create({
          content: "Please wait..."
        });
        loader.present();
        if (this.sub) {
          this.sub.unsubscribe();
        }
        this.userService.ownerChangedRef().once('value').then((snap) => {
          let user = snap.val();
          setTimeout(function () {
            that.showSidePanel = false;
            that.rootPage = LoginPage;
            console.log(user);
            user.isOnline = false;
            user.lastOnlineTime = new Date();
            setTimeout(function () {
              that.userService.updateOwnerWithPromise(user).then(function () {
                that.afAuth.auth.signOut().then(function () {
                  loader.dismiss();
                }, function () {
                  loader.dismiss();
                });
              });
            }, 500);
          }, 500);
        });
        break;
      case 'Profile':
        this.nav.setRoot('Profile', {
          is_owner: true
        });
        break;
      default:
        this.rootPage = page;
        break;
    }
  }

}