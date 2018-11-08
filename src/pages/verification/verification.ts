import { Component , OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController , ToastController , AlertController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthService } from '../../providers/auth-service';
import { UserService } from '../../providers/user-service';
import { User } from '../../model/user.model';

@IonicPage()
@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html',
})
export class Verification implements OnInit{
  initMessage: boolean = true;
  emailSend: boolean = false;
  errorMessage: boolean = false;
  email: string;
  sub:any;
  user:User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public userService:UserService, 
    public loadingCtrl: LoadingController,
    public toastCtrl:ToastController,
    public alertCtrl:AlertController
  ) {
       
  }

  ngOnInit(){
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.userService.ownerChangedRef().once('value').then(
        (snap) => {
          this.user = snap.val();
          console.log(this.user);
          loading.dismiss();
        }
      );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Verification');
  }

  reSend(number){
    console.log(number);
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    })
    loader.present();
    this.authService.sendSms(number,'+91',this.authService.genRand(),
    function(successSms){
        loader.dismiss();
    },function(errorSMS){
        loader.dismiss();
    });
  }

  onSubmit(formData){
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.userService.ownerChangedRef().once('value').then(
        (snap) => {
              this.user = snap.val();
              console.log(this.user);
              console.log(this.user.otp);
              console.log(formData.value.code);
            if(formData.value.code==this.user.otp){
                  this.user.is_phone_verified = true;
                  this.userService.updateOwner(this.user);
                  let toast = this.toastCtrl.create({
                    message: 'Your Account succcessfully verified.',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  this.navCtrl.setRoot(LoginPage);
            }else{
                  let toast = this.toastCtrl.create({
                    message: 'Your OTP is incorrect. Please check your Inbox ',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
            }
                loading.dismiss();
        }
      );
  }

  sendEmail() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.authService.currentUser().sendEmailVerification().then((success) => {
      // console.log(success);
      this.initMessage = false;
      this.errorMessage = false;
      // console.log('verification:',this.authService.currentUser());
      this.email = this.authService.currentUser().email
      this.emailSend = true;
      loading.dismiss();
    }, function (error) {
      // console.log(error);
      this.initMessage = false;
      this.errorMessage = true;
      loading.dismiss();
    })
  }

  presentPrompt() {
  let self=this;
  let alert = this.alertCtrl.create({
    title: 'Change your number.',
    inputs: [
      {
        name: 'phone',
        type:'tel',
        placeholder: 'Enter Phone number'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Change',
        handler: data => {
          if(data.phone){
            this.user.phone=data.phone;
            this.userService.updateOwnerWithPromise(this.user).then(function(){
                self.reSend(data.phone);
            });
            
          }else{
            let toast = this.toastCtrl.create({
              message: 'Please enter valid phone nubmer.',
              duration: 3000,
              position: 'top'
            });
            toast.present();

            return false;
          }
          console.log(data);
        }
      }
    ]
  });
  alert.present();
}

  change(){
    this.presentPrompt();
  } 

}
