import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from './../model/user.model'
import { Search } from './../model/search.model';
import { UserService } from './user-service';
import { GeoService } from './geo-service';

import * as _ from "lodash";

@Injectable()
export class SearchService {
  geocoder:any;
  // geodistService:any;
  autocompleteService:any;

  constructor(
    public af: AngularFireDatabase,
    public userService: UserService,
    public geoService: GeoService
  ) {
    
  }

  setDefaultSearch(ownerUid, searchObj) {
    this.af.database.ref('/defaultSearchPreference/' + ownerUid).set(searchObj);
  }

  getDefaultSearchRef(ownerUid) {
    return this.af.database.ref('/defaultSearchPreference/' + ownerUid);
  }

  deleteDefaultSearch(ownerUid) {
    let obj = this.af.object('/defaultSearchPreference/' + ownerUid);
    obj.remove();
  }

  addSearchList(ownerUid, searchObj: Search) {
    let search = this.af.list('/searchPreference/' + ownerUid);
    search.push(searchObj);
  }

  updateSearchList(ownerUid, key, searchObj: Search) {
    let obj = this.af.object('/searchPreference/' + ownerUid + '/' + key);
    obj.update(searchObj);
  }

  deleteSearchList(ownerUid, key) {
    let obj = this.af.object('/searchPreference/' + ownerUid + '/' + key);
    obj.remove();
  }

  getSearchList(ownerUid) {
    return this.af.list('/searchPreference/' + ownerUid);
  }

  getSearchRef(ownerUid, searchID) {
    return this.af.database.ref('/searchPreference/' + ownerUid + '/' + searchID);
  }

  blockUserFilter(list, ownerUid, cb){
    this.userService.getListOfBlockedUser(ownerUid,(blkUserlist)=>{
      if(blkUserlist){
        list = _.filter(list, (user: User) => {
          return !blkUserlist[user.key || user.$key];
        });
        cb(list);
      } else {
        cb(list);
      }
    });
  }

  filterUserList(list, filterRef:Search, ownerUid, cb) {
    let tempList = _.cloneDeep(list);
    if (filterRef) {
      this.userService.getOwnerSubRef().once('value').then(snap=>{
        let currentUser:User = snap.val();
        // Filter by basic criteria where user has completed the profile and active
        
        tempList = _.filter(tempList, { 'profileActive': true, 'profileCompleted': true });

        // Except Own profile
        tempList = _.reject(tempList, ['key', ownerUid]);
        // Remove block user
        this.blockUserFilter(tempList, ownerUid, (list)=>{
          tempList = list;
          // set the distance
          _.each(tempList, (user: User) => {
            user.distance = this.geoService.distance(currentUser.currentLocation,user.currentLocation);
          });
          // Has Profile Photo
          if(filterRef.option.photo){
            tempList = _.reject(tempList, ['profilePicPath', '']);
          }        
          // Paid members only
          if(filterRef.option.paid){
            tempList = _.reject(tempList, ['isPaidMember', false]);
          }        
          // Filter for rating: number = 0;
          tempList = _.filter(tempList, (user: User) => {
            return ((user.starRating === 0) ||(user.starRating >= filterRef.rating));
          });
          // Filter for ageRange = {lower: 23,upper: 40};
          tempList = _.filter(tempList, (user: User) => {
            return user.age >= filterRef.ageRange.lower && user.age <= filterRef.ageRange.upper;
          });
          // Filter for heightRange = {lower: 58,upper: 70};
          tempList = _.filter(tempList, (user: User) => {
            return user.height >= filterRef.heightRange.lower && user.height <= filterRef.heightRange.upper;
          });
          // Filter for option = {photo: true,viewed: true,viewedMe: true,favorited: true,unviewed: true,favoritedMe: true};
          // Filter for bodyType
          if (filterRef.bodyType.length) {
            tempList = _.filter(tempList, (user: User) => {
              return (filterRef.bodyType.indexOf(user.bodyType) >= 0);
            });
          }
          // Filter for ethnicity
          if (filterRef.ethnicity.length) {
            tempList = _.filter(tempList, (user: User) => {
              return (filterRef.ethnicity.indexOf(user.ethnicity) >= 0);
            });
          }
          // Filter for hairColor
          if (filterRef.hairColor.length) {
            tempList = _.filter(tempList, (user: User) => {
              return (filterRef.hairColor.indexOf(user.hairColor) >= 0);
            });
          }
          // Filter for smoking
          if (filterRef.smoking.length) {
            tempList = _.filter(tempList, (user: User) => {
              return (filterRef.smoking.indexOf(user.smoking) >= 0);
            });
          }
          // Filter for drinking
          if (filterRef.drinking.length) {
            tempList = _.filter(tempList, (user: User) => {
              return (filterRef.drinking.indexOf(user.drinking) >= 0);
            });
          }
          // Filter for relationship
          if (filterRef.relationship.length) {
            tempList = _.filter(tempList, (user: User) => {
              return (filterRef.relationship.indexOf(user.relationship) >= 0);
            });
          }
          // Filter for education
          if (filterRef.education.length) {
            tempList = _.filter(tempList, (user: User) => {
              return (filterRef.education.indexOf(user.education) >= 0);
            });
          }
          // Filter for location: string = 'current';
          if(filterRef.location === 'current'){
            tempList = _.filter(tempList, (user: User) => {
              let distance = this.geoService.distance(currentUser.currentLocation,user.currentLocation);
              return (distance <= filterRef.distance);
            });
            cb(tempList);
            return;
          } else if (filterRef.location === 'home'){
            tempList = _.filter(tempList, (user: User) => {
              let distance = this.geoService.distance(currentUser.homeLocation,user.homeLocation);
              return (distance <= filterRef.distance);
              // return ((currentUser.country === user.country) && (currentUser.state === user.state) /* && (currentUser.city === user.city) */);
            });
            cb(tempList);
            return;
          } else if (filterRef.location === 'other') { // other
            this.geoService.getGeoFromLoc(filterRef.otherLoc,(otherLatLng)=>{
              tempList = _.filter(tempList, (user: User) => {
                let distance = this.geoService.distance(otherLatLng,user.homeLocation);
                return (distance <= filterRef.distance);
                // return ((currentUser.country === user.country) && (currentUser.state === user.state) /* && (currentUser.city === user.city) */);
              });
              cb(tempList);
              return;
            });
          } else {
            cb(tempList);
            return;
          }
        });
        
      });
    }
    // Filter Looking For
  }

  sort(list,item):any{
    return _.sortBy(list,item);
  }

  setReverse(list):any{
    return _.reverse(list);
  }

  extendObj(destination, source) {
    return _.assignIn(destination, source);
  }
 
}