import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { AppService } from '../../providers/app-service';
import { SearchService } from '../../providers/search-service';
import { GeoService } from '../../providers/geo-service';
import { User } from '../../model/user.model';
import { PlaceSearchModalPage } from '../place-search-modal/place-search-modal';
//import native camera 
import { Camera, CameraOptions } from '@ionic-native/camera';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfile {
  pageTitle: string;
  user: User;
  profileImage: any;
  floor: any = Math.floor;
  profilePicPath = '';
  maxYear: number = (new Date()).getFullYear() - 18;

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    targetWidth: 600,
    targetHeight: 600,
    allowEdit: true
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    private camera: Camera,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public appService: AppService,
    public geoService: GeoService,
    public searchService: SearchService
  ) {
    this.pageTitle = "Edit Profile";
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.userService.ownerChanged().subscribe(value => {
      this.user = value;
      if (!this.user.homePlace) {
        let latlng = {
          lat: this.user.currentLocation.lat,
          lng: this.user.currentLocation.lng
        };
        this.geoService.getCurrentLocFromGeo(latlng, (place) => {
          this.user.homePlace = place;
          loading.dismiss();
        });
      } else {
        loading.dismiss();
      }
    },
      console.log,
      () => console.log('finish')
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfile');
  }

  showAddressModal() {
    let modal = this.modalCtrl.create(PlaceSearchModalPage);
    modal.onDidDismiss(data => {
      console.log(data);
      this.user.homePlace = data;
    });
    modal.present();
  }

  navigateToProfile() {
    let tempObj = { is_owner: true };
    if (!this.userService.isProfileCompleted(this.user)) {
      let confirm = this.alertCtrl.create({
        title: 'Warning',
        message: 'Please fill the mandatory fields User Name, Date of Birth, Gender and Location',
        buttons: [{
          text: 'OK'
        }]
      });
      confirm.present();
    } else {
      let address = this.user.homePlace;
      console.log(address);
      this.geoService.getGeoFromLoc(address, (latlngObj) => {
        if (latlngObj) {
          this.user.homeLocation = latlngObj;
          this.userService.updateOwner(this.user);
          this.navCtrl.push('Profile', tempObj);
        } else {
          let confirm = this.alertCtrl.create({
            title: 'Warning',
            message: 'Location "' + address + '"not found',
            buttons: [{
              text: 'OK'
            }]
          });
          confirm.present();
        }
      });
    }
  }

  goToUploadPic() {
    this.navCtrl.push('UploadPic');
  }

  openCamera(is_camera: boolean) {
    if (!is_camera) {
      this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    } else {
      this.options.sourceType = this.camera.PictureSourceType.CAMERA;
    }
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.profilePicPath = 'data:image/jpeg;base64,' + imageData;
      this.upload();
    }, (err) => {
      // Handle error 
    });
  }

  upload() {
    let that=this;

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`profilePics/${filename}.jpg`);
    loading.present();
    imageRef.putString(this.profilePicPath, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {

      let finalObj = {
        is_approved: false,
        url: "",
        is_profile: true
      };
      finalObj.url = snapshot.downloadURL;

      this.userService.createCoverPicture(finalObj).then((obj)=> {
        console.log(obj.key);
        loading.dismiss();
        that.navCtrl.push('UploadPic');
      }).catch(function () {
        loading.dismiss();
      });
    });
  }

}
