import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable } from 'angularfire2/database';
import { User } from './../model/user.model';
import { Comment } from './../model/comment.model';
import { Rating } from './../model/rating.model';
import { GeoService } from './geo-service';

@Injectable()
export class UserService {
  owner:User;
  trialPeriodInDays:number = 7;

  constructor(
    private af: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private geoService: GeoService) {      
    // this.retrieveOwner();
  }

  retrieveOwner():void{
    if(this.afAuth.auth.currentUser){
      let ownerUid = this.afAuth.auth.currentUser.uid;
      this.af.object('/users/'+ ownerUid).subscribe(
        value => this.owner = value
      );
    }
  }

  isProfileCompleted(obj:User):boolean{
		if(
			obj.userName !== '' &&
			// obj.description !== '' &&
			obj.dateOfBirth !== '' &&
			obj.gender !== '' &&
			// obj.lookingFor !== '' &&
      obj.homePlace !== '' &&      
      obj.lookingFor!==''
      //&&
			// obj.hairColor !== '' &&
			// obj.age !== 0 &&
			// obj.bodyType !== '' &&
			// obj.ethnicity !== '' &&
			// obj.smoking !== '' &&
			// obj.drinking !== '' &&
			// obj.education !== '' &&
			// obj.occupation !== '' &&
			// obj.relationship !== '' &&
			// obj.children !== ''
		) {
			return true;
		} else {
			return false;
		}
	}
	setProfileCompletionStatus(obj){
		obj.profileCompleted = this.isProfileCompleted(obj);
    return obj;
	}

  getOwnerId():string{
    if(this.afAuth.auth.currentUser){
      return this.afAuth.auth.currentUser.uid;
    }
  }

  getOwner():User{
    return this.owner;
  }

  getOwnerSub():FirebaseObjectObservable<any>{
    return this.af.object('/users/'+ this.afAuth.auth.currentUser.uid);
  }
  getOwnerSubRef(){
    return this.af.database.ref('/users/'+ this.afAuth.auth.currentUser.uid);
  }


  ownerChanged(): FirebaseObjectObservable<any>{
    if(this.afAuth.auth.currentUser){
      let ownerUid = this.afAuth.auth.currentUser.uid;
      return this.af.object('/users/'+ ownerUid);      
    } else {
      var f:FirebaseObjectObservable<any>;
      return f;
    }
  }

  ownerChangedRef(){
    if(this.afAuth.auth.currentUser){
      let ownerUid = this.afAuth.auth.currentUser.uid;
      return this.af.database.ref('/users/'+ ownerUid);
    } 
  }

  addComment(comment:Comment){
    let ownerUid = this.afAuth.auth.currentUser.uid;
    comment.time = Date.now();
    this.af.list('/comments/'+ownerUid).push(comment);
  }

  updateOwner(updatedUser:User){
    let ownerUid = this.afAuth.auth.currentUser.uid;
    if(updatedUser.dateOfBirth){
      updatedUser.age = this.calculateAge(updatedUser.dateOfBirth);
    }
    updatedUser = this.setProfileCompletionStatus(updatedUser);
    let user = this.af.object('/users/'+ ownerUid);
    user.update(updatedUser);
  }

  updateOwnerWithPromise(updatedUser:User){
    let ownerUid = this.afAuth.auth.currentUser.uid;
    if(updatedUser.dateOfBirth){
      updatedUser.age = this.calculateAge(updatedUser.dateOfBirth);
    }
    updatedUser = this.setProfileCompletionStatus(updatedUser);
    let user = this.af.object('/users/'+ ownerUid);
    return user.update(updatedUser);
  }

  createUser(uid:string, user:User, errorCallBack){
    user.profileCreationDate = Date.now();
    this.af.database.ref('/users/'+uid).set(user);
  }

  setWemet(toUserUid,flag){
    this.af.database.ref('/wemet/' + this.getOwnerId() + '/' + toUserUid).set(flag);    
  }
  
  getWemet(toUserUid){
    return this.af.object('/wemet/' + this.getOwnerId() + '/' + toUserUid);
  }
  
  checkWemet(toUserUid,cb){
    this.af.database.ref('/wemet/' + this.getOwnerId() + '/' + toUserUid).once('value').then(snap1 => {
      if(snap1.val()){
        this.af.database.ref('/wemet/' + toUserUid + '/' + this.getOwnerId()).once('value').then(snap2 => {
            cb(snap2.val());
        });
      } else {
        cb(false);
      }
    });
    // this.af.object('/wemet/' + this.getOwnerId() + '/' + toUserUid).subscribe(
    //   value => {
    //     if(value.$value){
    //       this.af.object('/wemet/' + toUserUid + '/' + this.getOwnerId()).subscribe(
    //         val => {
    //           cb(val.$value);
    //         }
    //       );
    //     } else {
    //       cb(false);
    //     }
    //   }
    // );
  }

  checkBlockedUser(toUserUid,cb){
    this.af.database.ref('/blockeduser/' + this.getOwnerId() + '/' + toUserUid).once('value').then(
      snap => {
        cb(snap.val());
      }
    );
  }

  getListOfBlockedUser(toUserUid,cb){
    this.af.database.ref('/blockeduser/' + this.getOwnerId()).once('value').then(
      snap => {
        cb(snap.val());
      }
    );
  }

  setViewedMe(toUserUid){
    this.getOwnerSubRef().once('value').then( snap =>{
      let user:User = snap.val();
      if(!user.hideViewSomeone){
        this.af.database.ref('/viwedMe/' + toUserUid + '/' + this.getOwnerId()).set(true);
      }
    });
    // let ownerRef = this.af.database.ref('/users').child(toUserUid);
    // ownerRef.once('value').then( user =>{
    //   let updatedUser = user.val();
    //   // updatedUser.viwedMeCount++;
    //   ownerRef.update(updatedUser);
    // });
  }
  
  getViewedMeList(){
    return this.af.list('/viwedMe/'+ this.getOwnerId());
  }

  setFavorite(toUserUid,flag){
    this.af.database.ref('/favorites/' + this.getOwnerId() + '/' + toUserUid).set(flag);
    // let ownerRef = this.af.database.ref('/users').child(this.getOwnerId());
    // ownerRef.once('value').then( user =>{
    //   let updatedUser = user.val();
    //   (flag)? updatedUser.favoriteCount++ : updatedUser.favoriteCount--;
    //   ownerRef.update(updatedUser);
    // });
    this.getOwnerSubRef().once('value').then( snap =>{
      let user:User = snap.val();
      if(!user.hideFevSomeone){
        this.af.database.ref('/favoritedMe/' + toUserUid + '/' + this.getOwnerId()).set(flag);  
        let userRef = this.af.database.ref('/users').child(toUserUid);
        userRef.once('value').then( user =>{
          let updatedUser = user.val();
          (flag)? updatedUser.favoriteMeCount++ : updatedUser.favoriteMeCount--;
          userRef.update(updatedUser);
        });
      }
    });
  }

  setBlockedUser(toUserUid,flag){
    this.af.database.ref('/blockeduser/'+ toUserUid + '/' + this.getOwnerId()).set(flag);
  }

  addReportUser(toUserUid,comment){
    this.af.database.ref('/reportUser/'+ this.getOwnerId() + '/' + toUserUid).set({
      comment:comment,
      reportTime:Date.now()
    });
  }

  // resetFavCount(){
  //   let ownerRef = this.af.database.ref('/users').child(this.getOwnerId());
  //   ownerRef.once('value').then( snap =>{
  //     let updatedUser = snap.val();
  //     updatedUser.favoriteCount = 0;
  //     ownerRef.update(updatedUser);
  //   });
  // }
  resetFavMeCount(){
    let ownerRef = this.af.database.ref('/users').child(this.getOwnerId());
    ownerRef.once('value').then( snap =>{
      let updatedUser = snap.val();
      updatedUser.favoriteMeCount = 0;
      ownerRef.update(updatedUser);
    });
  }
  resetViewedMeCount(){
    let ownerRef = this.af.database.ref('/users').child(this.getOwnerId());
    ownerRef.once('value').then( snap =>{
      let updatedUser = snap.val();
      updatedUser.viwedMeCount = 0;
      ownerRef.update(updatedUser);
    });
  }
  
  getFavorite(toUserUid){
    return this.af.object('/favorites/' + this.getOwnerId() + '/' + toUserUid);
  }

  getBlockedUserRef(toUserUid,cb){
    this.af.database.ref('/blockeduser/' + toUserUid + '/' + this.getOwnerId()).once('value').then((snap)=>{
      cb(snap.val());
    });
  }

  getBlockedUserRef2(toUserUid){
    return this.af.database.ref('/blockeduser/' + toUserUid + '/' + this.getOwnerId());
  }


  getReportUser(toUserUid,cb){
    this.af.database.ref('/reportUser/'+ this.getOwnerId() + '/' + toUserUid).once('value').then((snap)=>{
      cb(snap.val());
    });
  }

  getFavoriteList(){
    return this.af.list('/favorites/' + this.getOwnerId());
  }
  
  getFavoritedMeList(){
    return this.af.list('/favoritedMe/' + this.getOwnerId());
  }
  
  setRating(toUserUid,ratingObj:Rating){
    let toUserRef = this.getUser(toUserUid);
    this.getUserRef(toUserUid).once('value').then(snap => {
      let toUser = snap.val();
      if(toUser.starRating){
        toUser.starRating = Math.floor((toUser.starRating + ratingObj.ratingGiven)/2);
      } else {
        toUser.starRating = ratingObj.ratingGiven;
      }
      toUserRef.update(toUser);
      this.af.object('/ratings/'+ toUserUid + '/' + this.getOwnerId()).update(ratingObj);
    });  
  }

  getRating(fromUserID,toUserID){
    return this.af.object('/ratings/'+ toUserID + '/' + fromUserID);
  }

  getRatingList(uID){
    return this.af.list('/ratings/'+ uID);
  }
  getRatingListRef(uID){
    return this.af.database.ref('/ratings/'+ uID);
  }
  
	calculateAge(dob:string){
		let currentYear = (new Date()).getFullYear();
    let yob = Number.parseInt(dob.substring(-4));
    return currentYear - yob;
	}

  getUserList(lookingFor):FirebaseListObservable<any>{
    console.log('lookingFor',lookingFor);
    if(lookingFor === 'Men'){
      return this.af.list('/users', {
        query: {
          orderByChild: 'gender',
          equalTo: 'Male'
        }
      });
    }else if (lookingFor === 'Women'){
      return this.af.list('/users', {
        query: {
          orderByChild: 'gender',
          equalTo: 'Female'
        }
      });
    } else {
      return this.af.list('/users', {
        query: {
          limitToLast: 100
        }
      });
    }
  }

  getUserListRefOnce(lookingFor){
    if(lookingFor === 'Men'){
      return this.af.database.ref('/users').orderByChild("gender").equalTo('Male').once('value');
    }else if (lookingFor === 'Women'){
      return this.af.database.ref('/users').orderByChild("gender").equalTo('Female').once('value');
    } else {
      return this.af.database.ref('/users').limitToLast(100).once('value');
    }
  }

  getSortedUserList(value:any,limit:any):FirebaseListObservable<any>{
     let sortedKey="";
     if(value=='profile' || value=='gps'){
        sortedKey='isOnline';
     }else{
       sortedKey=value;
     }
     let query={
       query:{
         orderByChild:sortedKey,
         limitToFirst:limit
       }
     }
     return this.af.list('/users',query);
  }

  isPhoneExist(phoneNo,success){
    let query={
       query:{
        orderByChild: 'phone',
        equalTo: phoneNo
       }
     }
     this.af.list('/users',query).subscribe(
       listData=>{
          success(listData);
       },
       error=>{
        success(error);
       }
     );
  }

  getUser(uid):FirebaseObjectObservable<any>{
    return this.af.object('/users/'+ uid);
  }
  getUserRef(uid){
    return this.af.database.ref('/users/'+ uid);
  }

  updateUserLocation(){
    this.geoService.getCurrentLocGeo().then((resp) => {
      this.ownerChangedRef().once('value').then(
        (snap) => {
          let user:User = snap.val(); 
          user.currentLocation.lat=resp.coords.latitude;
          user.currentLocation.lng=resp.coords.longitude;
          this.geoService.getCurrentLocFromGeo(user.currentLocation,(place:string)=>{
            user.currentPlace = place;
            this.updateOwner(user);
          });
        }
      );
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  createCoverPicture(data){
    return this.af.database.ref('/coverImages/'+this.getOwnerId()).push(data);
  }

  updateCoverPic(data){
    return this.af.database.ref('/coverImages/'+this.getOwnerId()).set(data);
  }
  getCoverImagesList(uid){
      return this.af.list('/coverImages/'+ uid);
  }

  removeImage(id){
    return this.af.object('/coverImages/'+ this.getOwnerId() +"/"+ id).remove();
  }

  getCityList(country){
    return this.af.database.ref('/countryCity/'+ country);
  }

}
