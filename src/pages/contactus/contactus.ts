import { Component } from '@angular/core';
import { IonicPage, NavController,ToastController,AlertController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { Comment } from '../../model/comment.model';

@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class Contactus {
  pageTitle: String;
  comment: Comment = new Comment();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public userService: UserService,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.pageTitle = "Contact Us";
  }

  reset(){
    this.comment = new Comment();    
  }

  submitComment() {
    let alert = this.alertCtrl.create({
      title: 'Submit Message?',
      message: 'Do you want to submit this message to the Admin?',
      buttons: [{
        text: 'Cancel',
        handler: () => {
          alert = null;
        }
      }, {
        text: 'Submit',
        handler: () => {
          this.userService.addComment(this.comment);
          this.comment = new Comment();
          let toast = this.toastCtrl.create({
            message: 'Successfully submitted',
            duration: 2000,
            position: 'top'
          });
          toast.present();
        }
      }]
    });
    alert.present();   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Contactus');
  }

}
