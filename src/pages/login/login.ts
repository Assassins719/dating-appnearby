import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Storage } from '@ionic/storage';
import { User } from '../../model/user.model';
import { UserService } from '../../providers/user-service';
import { AppService } from '../../providers/app-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit, OnDestroy {
  error: any;
  autoLogin: boolean = true;
  user: User;
  sub: any;

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    public toastCtrl: ToastController,
    public appService: AppService
  ) {
    // this.afAuth.auth.signInAnonymously();
    // this.user = this.afAuth.authState;

  }

  navigateToSignup() {
    this.navCtrl.push('Signup');
  }

  ngOnInit() {
    // this.afAuth.authState.subscribe(auth => { 
    //   if(auth) {
    //     this.autoLogin = true;
    //     this.navCtrl.push(SearchListMenu);
    //   } else {
    //     this.autoLogin = false;
    //   }
    // }); 
  }

  ionViewDidLoad() {
  }

  ngOnDestroy() {
    //this.afAuth.auth.signOut();
  }

  onSubmit(formData) {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });

    if (formData.valid) {

      loader.present();
      this.authService.login(
        formData.value,
        (success) => {

          this.userService.ownerChangedRef().once('value').then(
            (snap) => {
              this.user = snap.val();
              if (!this.user.is_phone_verified) {

                let toast = this.toastCtrl.create({
                  message: 'Your Phone number is not varified . Please verify your phone .',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
                this.navCtrl.setRoot('Verification');

              } else {

                this.sub = this.userService.ownerChangedRef().once('value').then(
                  (snap) => {
                    this.user = snap.val();

                    console.log('online status changed');

                    if (!this.user.firstTimeLogin) {
                      this.user.isOnline = true;
                      this.user.firstTimeLogin = true;
                      console.log(this.user);
                      this.userService.updateOwner(this.user);
                      this.userService.retrieveOwner();
                      this.appService.setRoute(true);
                      //this.navCtrl.setRoot('SearchListMenu');

                    }
                    this.storage.set('first_time', true);
                  }
                );
              }
              loader.dismiss();

            }
          );

        },
        (err) => {
          this.error = err
          loader.dismiss();
        }
      );
    }
  }

  navigateToForgetPassword() {
    this.navCtrl.push('ForgetPassword');
  }

}
