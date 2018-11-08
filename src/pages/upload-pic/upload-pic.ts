import { Component , OnInit, OnDestroy} from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController} from 'ionic-angular';
import firebase from 'firebase';
import { UserService } from '../../providers/user-service';
import { User } from '../../model/user.model'

//import native camera 
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the UploadPic page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-upload-pic',
  templateUrl: 'upload-pic.html',
})
export class UploadPic implements OnInit , OnDestroy{
  
  public coverPics:any;
  user:User;
  ownerId:any;
  selectedPic:any;
  floor:any = Math.floor;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams , 
    public userService: UserService,
    private camera: Camera,
    public loadingCtrl: LoadingController) {
      this.coverPics=[];
  }

  ngOnInit(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    
    this.userService.getCoverImagesList(this.userService.getOwnerId()).subscribe(
      value=>{
          this.coverPics=value;

          if(this.coverPics.length>0){
            this.selectedPic=this.coverPics[0];
          }
          console.log(this.coverPics);
          setTimeout(function(){
               loading.dismiss();
          },1000);
         
      },
      error=>{

      },()=>console.log("Complete")
    )
  }

  ngOnDestroy(){
    //this.userService.getCoverImagesList().
  }

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation:true ,
    targetWidth:600,
    targetHeight:600,
    allowEdit:true 
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPic');
  }

  openCamera(is_camera:boolean){

    if(!is_camera){
      this.options.sourceType=this.camera.PictureSourceType.PHOTOLIBRARY;
    }else{
      this.options.sourceType=this.camera.PictureSourceType.CAMERA;
    }

    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
       let data='data:image/jpeg;base64,' + imageData;
       this.upload(data);
      }, (err) => {
      // Handle error 
    });
  }

  upload(imgUrl) {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`profilePics/${filename}.jpg`);
    loading.present();
    imageRef.putString(imgUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
      let finalObj={
          is_approved:false,
          url:"",
          is_profile:false
      };
      finalObj.url=snapshot.downloadURL;
      console.log(finalObj);
      this.userService.createCoverPicture(finalObj).then(function(obj){
        loading.dismiss();
      }).catch(function(){
        loading.dismiss();
      });
      
     // Do something here when the data is succesfully uploaded!
    });

  }

  remove(item){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.userService.removeImage(item.$key).then(function(){
      loading.dismiss();
    }).catch(function(){
      loading.dismiss();
    });
  }

  select(item){
    this.selectedPic=item;
  }

  setProfile(){
    var self=this;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.userService.ownerChangedRef().once('value').then(
        (snap) => {
          let user:User = snap.val(); 
          user.profilePicPath=this.selectedPic.url;
          for(var i=0; i < this.coverPics.length; i++){
            if(this.coverPics[i]['url']==this.selectedPic.url){
                 this.coverPics[i]['is_profile']=true
            }else{
                 this.coverPics[i]['is_profile']=false;
            }
             
          }
          self.userService.updateCoverPic(this.coverPics).then(function(){
            self.userService.updateOwnerWithPromise(user).then(function(){
              loading.dismiss();
            });
          })
          
        }
      );
  }


}
