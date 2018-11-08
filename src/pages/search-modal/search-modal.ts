import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { AppService } from '../../providers/app-service';
import { SearchService } from '../../providers/search-service';
import { Search } from '../../model/search.model';
// import { User } from '../../model/user.model';
import { PlaceSearchModalPage } from '../place-search-modal/place-search-modal';

@IonicPage()
@Component({
  selector: 'page-search-modal',
  templateUrl: 'search-modal.html',
})
export class SearchModal {

  floor: any = Math.floor;
  srchRef: Search;
  searchList:any[] = []; 
  currentSearchItem:any;
  ownerUID:string;
  stateList: any = [];
  cityList: any = [];
  currentPlace = '';

  bodyTypeList = ["Slim","Athletic","Average","Curvy","A few extra pounds","Full/Overweight","Other"];
  ethnicityList = ["Asian","Black/African Descent","Latin/Hispanic","East Indian","Middle Eastern","Mixed","Native American","Pacific Islander","White/Cascasian","Other"];
  hairColorList = ["Auburn","Black","Blonde","Light Brown","Dark Brown","Grey","Red"];
  smokingList = ["Non Smoker","Light Smoker","Heavy Smoker"];
  drinkingList = ["Non Drinker","Social Drinker","Heavy Drinker"];
  relationshipList = ["Single","Divorced","Separated","Married but Looking","Open Relationship","Widowed"];
  educationList = ["High School","Some College","Associates Degree","Bachelors Degree","Graduate Degree","PhD/Post Doctoral"];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl:ModalController,
    public searchSrvc: SearchService,
    public alertCtrl: AlertController,    
    public userService: UserService,
    public appService: AppService
  ) {
    this.srchRef = new Search();
    this.ownerUID = this.userService.getOwnerId();
    this.searchSrvc.getDefaultSearchRef(this.ownerUID).once('value').then(
      snap => {
        let srchRef:Search;
        this.searchSrvc.getSearchList(this.ownerUID).subscribe(
          list => {
            if(list){
              this.searchList = list;
              if (snap.val()) {
                srchRef = this.searchSrvc.extendObj(new Search(),snap.val());
                setTimeout(()=> {
                  this.srchRef = srchRef
                  for(let item of list){
                    if(item.title === this.srchRef.title){
                      this.currentSearchItem = item;
                    }
                  }
                }, 200);
              } 
            }
          }
        );
      }
    );
    this.userService.getOwnerSubRef().once('value').then(
      ownerSnap => {
        let user = ownerSnap.val();
        this.currentPlace = user.currentPlace;
      }
    );
  }

  showAddressModal () {
    let modal = this.modalCtrl.create(PlaceSearchModalPage);
    modal.onDidDismiss(data => {
      console.log(data);
      this.srchRef.otherLoc = data;
    });
    modal.present();
  }

  updateOption(ref: string[], option, event, val) {
    if (event.target.checked) {
      ref.push(val);
    } else {
      ref = ref.splice(ref.indexOf(val), 1);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchModal');
  }

  search() {
    if(this.srchRef.location === 'other'){
      if(this.srchRef.otherLoc){
        this.searchSrvc.setDefaultSearch(this.ownerUID,this.srchRef);
        this.viewCtrl.dismiss(this.srchRef);
      } else {
        let confirm = this.alertCtrl.create({
          title: 'Warning',
          message: 'Other Location address not found. Please try something else.',
          buttons: [{
            text: 'OK'
          }]
        });
        confirm.present();
      }
    } else {
      this.searchSrvc.setDefaultSearch(this.ownerUID,this.srchRef);
      this.viewCtrl.dismiss(this.srchRef);
    }
  }

  loadSearch(){
    this.srchRef = this.searchSrvc.extendObj(new Search(),this.currentSearchItem);
    console.log(this.srchRef);
  }

  reset() {
    let confirm = this.alertCtrl.create({
      title: 'Reset',
      message: 'Do you want to reset the search preferences?',
      buttons: [{
        text: 'No'
      }, {
        text: 'Yes',
        handler: () => {
          this.currentSearchItem = '';
          this.srchRef = new Search();
        }
      }]
    });
    confirm.present();
  }
  update() {
    let confirm = this.alertCtrl.create({
      title: 'Update',
      message: 'Do you want to update the existing search preferences "'+this.currentSearchItem.title+'"?',
      buttons: [{
        text: 'No'
      }, {
        text: 'Yes',
        handler: () => {
          this.searchSrvc.updateSearchList(this.ownerUID,this.currentSearchItem.$key,this.currentSearchItem);
        }
      }]
    });
    confirm.present();
  }
  delete() {
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Do you want to delete the existing search preferences "'+this.currentSearchItem.title+'"?',
      buttons: [{
        text: 'No'
      }, {
        text: 'Yes',
        handler: () => {
          this.searchSrvc.deleteSearchList(this.ownerUID,this.currentSearchItem.$key);
          this.currentSearchItem = undefined;
        }
      }]
    });
    confirm.present();
  }
  save() {
    let confirm = this.alertCtrl.create({
      title: 'Save',
      message: 'Do you want to create a new search preferences?',
      inputs: [{
        name: 'title',
        placeholder: 'Search Save As...'
      }],
      buttons: [{
        text: 'Cancel'
      }, {
        text: 'Save',
        handler: data => {
          if(data.title){
            this.srchRef.title = data.title;
            this.searchSrvc.addSearchList(this.ownerUID,this.srchRef);
            setTimeout(()=> {
              this.currentSearchItem = this.srchRef;
            }, 500);
          }
        }
      }]
    });
    confirm.present();
  }

}
