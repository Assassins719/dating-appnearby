import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController , ToastController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

/**
 * Generated class for the ForgetPassword page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPassword {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authService:AuthService,
    public loadingCtrl:LoadingController,
    private toastCtrl: ToastController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPassword');
  }

  forgetPassword(){
    
  }

  onSubmit(formData) {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });

    let toast = this.toastCtrl.create({
      message: 'User was added successfully',
      duration: 3000,
      position: 'top'
    });


    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    if(formData.valid) {
      loader.present();
      this.authService.forgetPassword(formData.value.email).then(
       (success)=>{
         console.log(success);
         toast.setMessage("Please check your email id.");
        toast.present();
         this.navCtrl.pop();
         loader.dismiss(); 
       },
       (error)=>{
        loader.dismiss();
        console.log(error);
        toast.setMessage(error.message);
        toast.present();
       }
     );
    }
  }

}
