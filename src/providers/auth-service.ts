import { Injectable } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from './../model/user.model'
import { UserService } from './user-service';
import * as firebase from 'firebase';

import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { FCM } from '@ionic-native/fcm';


@Injectable()
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth,
    public af: AngularFireDatabase,
    public userService:UserService,
    public http: Http,
    public fcm:FCM
  ) {

  }

  getCurrentOwner() {
    
    return this.afAuth.auth.currentUser;
  }

  updateEmail(email){
    return this.afAuth.auth.currentUser.updateEmail(email);
  }
  isLoginActive(): boolean {
    if (this.afAuth.auth.currentUser) {
      return true;
    }
    return false;
  }

  loginChanged(callback) {
    this.afAuth.authState.subscribe(callback);
  }

  login(value, succcess, error) {
    this.afAuth.auth.signInWithEmailAndPassword(
      value.email,
      value.password
    ).then(data => {
      console.log('success', data);
      succcess(data);
    }).catch(error);
  }

  singup(value, success, error) {

    this.afAuth.auth.createUserWithEmailAndPassword(
      value.email,
      value.password
    ).then((user) => {
      let uid = user.uid;
      let newUser = new User(value);
      this.userService.createUser(uid, newUser, error);
      success();
    }).catch(error);
  }

  forgetPassword(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);

    
  }

  logout() {
    this.userService.ownerChangedRef().once('value').then(
      (snap) => {
        let user = snap.val();
        console.log(user);
        user.isOnline = false;
        user.lastOnlineTime = new Date();
        this.userService.updateOwner(user);
        return this.afAuth.auth.signOut();
      }
    );
    this.userService.ownerChangedRef().once('value').then(
      (snap) => {
        let user = snap.val();
        console.log(user);
        user.isOnline = false;
        user.lastOnlineTime = new Date();
        this.userService.updateOwner(user);
        return this.afAuth.auth.signOut();
      }
    );
  }

  updatePushId(){
    this.fcm.getToken().then(token=>{
      console.log(token);
      this.userService.ownerChangedRef().once('value').then(
        (snap) => {
          let user = snap.val();
          user['push_id']=token;
          this.userService.updateOwner(user);
        }
      );
    });
  }

  currentUser(): any {
    let user = firebase.auth().currentUser;
    firebase
    return user;
  }

  genRand() {
    return Math.floor(Math.random() * 89999 + 10000);
  }

  sendSms(number: any, country_code, rendCode, successCB, errorCB) {

    let rendomCode = rendCode;
    let smsBody = "Your date app verification code is " + rendomCode;

    let body = {
      phone_number: number,
      code: country_code,
      sms_body: smsBody,
    };

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log('update user data with otp ' + rendomCode);
    console.log("ownerid" + this.userService.getOwnerId());

    this.http.post("https://twillosms.herokuapp.com/api", body, options).subscribe(
      success => {
        let userRef = this.af.database.ref('/users').child(this.userService.getOwnerId());
        userRef.once('value').then(user => {
          let updatedUser = user.val();
          updatedUser.optGenerateTime = new Date();
          updatedUser.otp = rendomCode;
          userRef.update(updatedUser);
          successCB(success);
        });
      }, error => {
        errorCB(error);
        console.log(error);
      }
    )
  }

}