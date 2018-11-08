import { Component, OnInit, OnDestroy} from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { SearchService } from '../../providers/search-service';
import { UserService } from '../../providers/user-service';
import { User } from '../../model/user.model';

@IonicPage()
@Component({
  selector: 'page-connect-tab',
  templateUrl: 'connect-tab.html',
})
export class ConnectTab implements OnInit, OnDestroy {

  tabList:any;
  activeTab:any;
  viewedMeUserList:User[] = [];
  favUserList:User[] = [];
  favMeUserList:User[] = [];
  pageTitle:String;
  unSubscriptionList:any[] = [];
  loader:any;
  pageName:String;
  viewedMeNoData:boolean = false;
  favNoData:boolean = false;
  favMeNoData:boolean = false;
  counter:number[] = [0,0,0];
  user:User;
  userSub:any;
  viewedMeSub:any;
  favSub:any;
  favMeSub:any;
  ascOrder:boolean = true;
  sortBy:string = 'isOnline';

  constructor(
      public navCtrl: NavController, 
      public userService: UserService,
      public loadingCtrl: LoadingController,
      public searchService: SearchService
    ) {
    this.tabList = [
      {name:'Viewed Me',id:1},
      {name:'Favorites',id:2},
      {name:'Favorited Me',id:3}
    ];    
    this.setTab(this.tabList[0]);
    this.pageTitle="Connect";
    this.pageName="ConnectTab";
  }

  ngOnInit(){
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
    this.userSub = this.userService.getOwnerSub().subscribe( user => {
      this.user = user;
      // this.counter[0] = this.user.viwedMeCount;
      // this.counter[1] = this.user.favoriteCount;
      this.counter[2] = this.user.favoriteMeCount;
      this.loader.dismiss();
    });
    this.viewedMeSub = this.userService.getViewedMeList().subscribe(list => {
      this.viewedMeUserList=[];
      if(list.length){
        this.viewedMeNoData = false;
        list.map(user => {
          if(user.$value){
            this.userService.getUserRef(user.$key).once('value').then(snap => {
              let userData = snap.val();
              userData.$key = user.$key;
              let sb = this.userService.getFavorite(user.$key).subscribe(
                val => userData.isFav = val.$value
              );
              this.viewedMeUserList.push(userData)
              this.unSubscriptionList.push(sb);
              this.searchService.blockUserFilter(this.viewedMeUserList,this.userService.getOwnerId(),(list)=>{
                this.viewedMeUserList = list;
                this.onCategoryChange('isOnline');
              });
            });
          }
        });
      } else {
        this.viewedMeNoData = true;
      }  
    });

    this.favSub = this.userService.getFavoriteList().subscribe(list => {
      this.favUserList=[];
      if(list.length){
        this.favNoData = false;
        list.map(user => {
          if(user.$value){
            this.userService.getUserRef(user.$key).once('value').then(snap => {
              let userData = snap.val();
              userData.$key = user.$key;
              let sb = this.userService.getFavorite(user.$key).subscribe(
                val => userData.isFav = val.$value
              );
              this.favUserList.push(userData)
              this.unSubscriptionList.push(sb);
              this.searchService.blockUserFilter(this.favUserList,this.userService.getOwnerId(),(list)=>{
                this.favUserList = list;
                this.onCategoryChange('isOnline');
              });
            });
          }
        });
      } else {
        this.favNoData = true;
      }   
    });

    this.favMeSub = this.userService.getFavoritedMeList().subscribe(list => {
      this.favMeUserList=[];
      if(list.length){
        this.favMeNoData = false;
        list.map(user => {
          if(user.$value){
            this.userService.getUserRef(user.$key).once('value').then(snap => {
              let userData = snap.val();
              userData.$key = user.$key;
              let sb = this.userService.getFavorite(user.$key).subscribe(
                val => userData.isFav = val.$value
              );
              this.favMeUserList.push(userData)
              this.unSubscriptionList.push(sb);
              this.searchService.blockUserFilter(this.favMeUserList,this.userService.getOwnerId(),(list)=>{
                this.favMeUserList = list;
                this.onCategoryChange('isOnline');
              });
            });
          }
        });
      } else {
        this.favMeNoData = true;
      }   
    });

  }

  ngOnDestroy(){
    this.unload();
    this.userSub.unsubscribe();
    this.viewedMeSub.unsubscribe();
    this.favSub.unsubscribe();
    this.favMeSub.unsubscribe();
  }

  unload(){
    if(this.unSubscriptionList.length){
      this.unSubscriptionList.map(sub => sub.unsubscribe());
    }
  }

  setTab(tab:any){
    this.activeTab=tab;
    if(tab.id === 1){
      // this.userService.resetViewedMeCount();
    } else if(tab.id === 2){
      // this.userService.resetFavCount();
    } else if(tab.id === 3){
      this.userService.resetFavMeCount();
    }
  }

  goToProfile(uid){
    console.log('uid : == ',uid);
    this.navCtrl.push('Profile',{
      uid:uid,
      is_owner: false
    });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ConnectTab');
  }

  onCategoryChange(item) {
    this.viewedMeUserList = this.searchService.sort(this.viewedMeUserList, item);
    this.favUserList = this.searchService.sort(this.favUserList, item);
    this.favMeUserList = this.searchService.sort(this.favMeUserList, item);
    this.ascOrder = true;
  }  

  reverseOrder(){
    this.viewedMeUserList = this.searchService.setReverse(this.viewedMeUserList);
    this.favUserList = this.searchService.setReverse(this.favUserList);
    this.favMeUserList = this.searchService.setReverse(this.favMeUserList);
  }

  toggleAscOrder(){
    this.ascOrder = !this.ascOrder;
    this.reverseOrder();
  }
}
