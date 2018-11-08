import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, ModalController, LoadingController, Platform, AlertController } from 'ionic-angular';
import { SearchModal } from '../search-modal/search-modal';
import { UserService } from '../../providers/user-service';
import { SearchService } from '../../providers/search-service';
import { AuthService } from '../../providers/auth-service';
import { User } from '../../model/user.model';
import { Search } from '../../model/search.model';
import * as _ from 'lodash';
import { FCM } from '@ionic-native/fcm';

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResult implements OnInit, OnDestroy {
  pageTitle: string;
  refineActive: boolean;
  userList: User[] = [];
  ownerID: string;
  pageName: String;
  searchRefineObj: Search;
  rawUserList: User[];
  getBasicSearchObject: Search;
  originalSarchObj: Search;
  userListObserber: any;
  ascOrder: boolean = true;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public userService: UserService,
    public searchService: SearchService,
    public loadingCtrl: LoadingController,
    public authService: AuthService,
    public platform: Platform,
    private fcm: FCM,
    public alertCtrl: AlertController

  ) {
    this.pageTitle = "Search Results";
    this.pageName = "SearchResult";
    this.ownerID = this.userService.getOwnerId();
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    let obj = new Search();
    this.userService.getOwnerSubRef().once('value').then(ownerSnap => {
      let user = ownerSnap.val();
      obj.lookingFor = user.lookingFor;
      this.originalSarchObj = _.cloneDeep(obj);
      this.getBasicSearchObject = _.cloneDeep(obj);
      this.searchService.getDefaultSearchRef(this.ownerID).once('value').then(searchSnap => {
        if (searchSnap.val()) {
          this.searchRefineObj = this.searchService.extendObj(this.getBasicSearchObject, searchSnap.val());
          this.refineActive = true;
        } else {
          this.searchRefineObj = this.getBasicSearchObject;
        }
        this.userService.getUserListRefOnce(obj.lookingFor).then(snapList => {
          let userList: Array<User> = [];
          snapList.forEach(snap => {
            let obj = snap.val();
            obj.key = snap.key;
            userList.push(obj);
          });
          this.rawUserList = _.reverse(userList);
          this.filterData();
          loader.dismiss();
        });
      });
    });

    //this.onNotification();
  }

  filterData() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.searchService.filterUserList(this.rawUserList, this.searchRefineObj, this.ownerID, filteredData => {
      if (filteredData) {
        this.showData(filteredData);
        loader.dismiss();
      }
    });
  }

  reverseOrder() {
    this.userList = this.searchService.setReverse(this.userList);
    console.log('this.userList', this.userList);
  }

  toggleAscOrder() {
    this.ascOrder = !this.ascOrder;
    this.reverseOrder();
  }

  ngOnInit() {

    var self=this;
    // FCM Push Notifaication handler 
    this.userService.updateUserLocation();
    if (this.platform.is('cordova')) {

      this.fcm.getToken().then(token=>{
        console.log(token);
        this.userService.ownerChangedRef().once('value').then(
          (snap) => {
            let user = snap.val();
            user['push_id']=token;
            this.userService.updateOwnerWithPromise(user).then(function(){
              self.fcm.onNotification().subscribe(data => {
                  console.log(data);

                  if (data.wasTapped) {
                    let uid=data.uid;
                    self.navCtrl.push('ChatDetails',{
                      toUserUid:uid
                    });
                    console.log("Received in background");
                  } else {
                    console.log("Received in foreground");
                  };
                },err=>{
                  alert(err);
                });
            });
          }
        );
      });
    }
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }

  ngOnDestroy() {
    // console.log('unsubscribe');
  }

  showData(dataList) {
    dataList.forEach(user => {
      this.userService.getFavorite(user.key).subscribe(
        val => user.isFav = val.$value
      );
    });
    this.userList = dataList;
    this.onCategoryChange('distance');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchResult');
  }

  goToProfile(uid) {
    console.log('uid', uid);
    this.navCtrl.push('Profile', {
      uid: uid,
      is_owner: false
    });
  }

  goToSearch() {
    let modal = this.modalCtrl.create(SearchModal);
    modal.onDidDismiss(data => {
      this.refineActive = true;
      this.searchRefineObj = data;
      this.filterData();
    });
    modal.present();
  }

  reset() {
    this.refineActive = false;
    this.searchService.deleteDefaultSearch(this.ownerID);
    this.searchRefineObj = _.cloneDeep(this.originalSarchObj);
    this.filterData();
  }

  onCategoryChange(item) {
    this.userList = this.searchService.sort(this.userList, item);
    this.ascOrder = true;
  }

  /*async onNotification(){
    try{
      await this.platform.ready();
      FCMPlugin.onNotification(
        (data) => {
          console.log(data);
        },
        (e) => {
         
          console.log(e);
        }
      );
    }
    catch(e){
      console.error(e);
    }
  }*/
}
