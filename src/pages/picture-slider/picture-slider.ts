import { Component , OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController , LoadingController} from 'ionic-angular';
import { UserService } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-picture-slider',
  templateUrl: 'picture-slider.html',
})
export class PictureSlider implements OnInit{

  listOfPics:any=[];
  userId:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController, 
    public userService:UserService, 
    public loadingCtrl:LoadingController
  ) {
    this.userId=this.navParams.data.user.$key
    //this.listOfPics.push(this.navParams.data.user.profilePicPath)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PictureSlider');
  }

  dismiss(){
  	this.viewCtrl.dismiss();
  }

  ngOnInit(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.userService.getCoverImagesList(this.userId).subscribe(
      success=>{
        console.log(success);
        let coverList=success;
        for(let i=0; i<coverList.length;i++){
          if(coverList[i]['is_approved']){
            this.listOfPics.push(coverList[i]);
          }
        }

        if(this.listOfPics.length>0){
          for(let i=0; i<this.listOfPics.length;i++){
            
          }
        }
        console.log(this.listOfPics);
        loading.dismiss();
      },
      error=>{
         console.log(error); 
         loading.dismiss();
      }
    )
  }


}
