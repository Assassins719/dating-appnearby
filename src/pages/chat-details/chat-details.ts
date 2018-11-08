import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { ChatPictureSlider } from '../chat-picture-slider/chat-picture-slider';
import { ChatHistory } from '../../model/chatHistory.model';
import { User } from '../../model/user.model';
import { Chat } from '../../model/chat.model';
import { ChatService } from '../../providers/chat-service';
import { UserService } from '../../providers/user-service';
import firebase from 'firebase';
//import native camera
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-chat-details',
  templateUrl: 'chat-details.html',
})
export class ChatDetails implements OnInit, OnDestroy {
  chatList: Chat[] = [];
  toUserUid: string;
  toUser: User;
  pageTitle: string;
  chatHistory: ChatHistory;
  chatLink: string;
  comment: string;
  chat: Chat;
  chatSub: any;
  chatAllowed: boolean = false;
  newChat: boolean = true;

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
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    private camera: Camera,
    public chatService: ChatService,
    public modalCtrl: ModalController,
    public userService: UserService,
    public alertCtrl: AlertController
  ) {
    if (navParams.data && navParams.data.toUserUid) {
      this.toUserUid = navParams.data.toUserUid;
      this.chat = new Chat();
      this.pageTitle = 'Chat';
    }
  }

  ngOnInit() {
    if (this.toUserUid) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      this.userService.getUserRef(this.toUserUid).once('value').then(
        snap => {
          this.toUser = snap.val();
          this.pageTitle = this.toUser.userName;
        }
      );
      this.chatService.getChatHistoryRef(this.toUserUid).once('value').then(
        snap => {
          let chatHistoryObj = snap.val();
          if (chatHistoryObj) {
            this.newChat = false;
            this.chatHistory = chatHistoryObj;
            this.chatLink = chatHistoryObj.chatLink;
            this.chatSub = this.chatService.getChatList(this.chatLink).subscribe(
              data => {
                console.log(data);
                this.chatList = data;
                this.chatService.resetChatCount(this.toUserUid);
                this.autoScrollToBottom();
              }
            );
          }
          loader.dismiss();
        }
      );
      let blockedUser: boolean = false;
      this.userService.getOwnerSubRef().once('value').then(snapOwner => {
        let owner: User = snapOwner.val();
        this.userService.getUserRef(this.toUserUid).once('value').then(snap => {
          let user: User = snap.val();
          this.userService.getBlockedUserRef2(this.toUserUid).once('value').then(snapFlag => {
            blockedUser = snapFlag.val();
            this.chatAllowed = (owner.isPaidMember || user.isPaidMember) && !blockedUser;
          });
        });
      });
    }

  }

  ngOnDestroy() {
    if (this.chatSub) {
      this.chatSub.unsubscribe();
    }
  }

  autoScrollToBottom() {
    setTimeout(() => {
      let chatList = document.getElementById("chatList");
      console.log('chatList scroll');
      chatList.scrollTop = chatList.scrollHeight;
    }, 100);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Chat');
  }

  chatEnter() {
    if (this.chatAllowed) {
      this.chat.chatType = 'Text'
      this.chat.sendingTime = Date.now();
      this.chat.senderUID = this.userService.getOwnerId();
      this.chat.receiverUID = this.toUserUid;
      // If new chat initiated
      if (this.newChat) {
        this.chatLink = this.chatService.getNewChatKey();
        this.chatSub = this.chatService.getChatList(this.chatLink).subscribe(
          data => {
            console.log(data);
            this.chatList = data;
            this.chatService.resetChatCount(this.toUserUid);
            this.autoScrollToBottom();
          }
        );
        this.chatService.appendChat(this.toUserUid, this.chatLink, this.chat, this.newChat);
        this.newChat = false;
      } else {
        this.chatService.appendChat(this.toUserUid, this.chatLink, this.chat, this.newChat);
      }
      this.chat = new Chat();
    } else {
      let confirm = this.alertCtrl.create({
        title: 'Warning!!',
        message: 'You may only message paid users when you have a free account. Do you want to go for subscription?',
        buttons: [{
          text: 'Cancel',
          handler: () => {
            this.chat = new Chat();
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.chat = new Chat();
            this.navCtrl.push('Subscribe');
          }
        }]
      });
      confirm.present();
    }
  }

  imagePopup(imagePath) {
    let modal = this.modalCtrl.create(ChatPictureSlider, { "path": imagePath });
    modal.present();
  }

  openCamera() {
    if (this.chatAllowed) {
      if (this.newChat) {
        this.chatLink = this.chatService.getNewChatKey();
        this.chatSub = this.chatService.getChatList(this.chatLink).subscribe(
          data => {
            console.log(data);
            this.chatList = data;
            this.chatService.resetChatCount(this.toUserUid);
            this.autoScrollToBottom();
          }
        );
        this.newChat = false;
      }
      this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
      this.camera.getPicture(this.options).then((imageData) => {
        this.chat.imagePath = 'data:image/jpeg;base64,' + imageData;
        this.upload();
      }, console.log);
      // If new chat initiated
    } else {
      let confirm = this.alertCtrl.create({
        title: 'Warning!!',
        message: 'You may only message paid users when you have a free account. Do you want to go for subscription?',
        buttons: [{
          text: 'Cancel',
          handler: () => {
            this.chat = new Chat();
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.chat = new Chat();
            this.navCtrl.push('Subscribe');
          }
        }]
      });
      confirm.present();
    }
  }

  upload() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`chatImages/${filename}.jpg`);
    loading.present();
    imageRef.putString(this.chat.imagePath, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      this.chat.chatType = 'Image'
      this.chat.imagePath = snapshot.downloadURL;
      this.chat.sendingTime = Date.now();
      this.chat.senderUID = this.userService.getOwnerId();
      this.chat.receiverUID = this.toUserUid;
      this.chatService.appendChat(this.toUserUid, this.chatLink, this.chat, this.newChat);
      this.chat = new Chat();
      loading.dismiss();
    });
  }

  goToProfile(uid){
    this.navCtrl.push('Profile',{
      uid:uid,
      is_owner: false
    });
  }
}
