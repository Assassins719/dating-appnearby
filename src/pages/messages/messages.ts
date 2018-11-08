import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ChatHistory } from '../../model/chatHistory.model';
import { ChatService } from '../../providers/chat-service';
import { UserService } from '../../providers/user-service';
import { SearchService } from '../../providers/search-service';

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class Messages implements OnInit, OnDestroy {
  pageTitle:string;  
  chatHistoryList:ChatHistory[];
  userSubList:any[] = [];
  chatHistSub:any;
  noChat:boolean = false;
  
  constructor(
    public navCtrl: NavController, 
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public chatService: ChatService,
    public searchService: SearchService,
    public userService: UserService
  ) {
    this.pageTitle = 'Messages';
  }

  ngOnInit(){
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.chatHistSub = this.chatService.getChatHistoryList().subscribe(
      snap => {
        if(snap.length === 0){
          this.noChat = true;
        } else {
          this.chatHistoryList = snap;
          if(this.chatHistoryList){
            this.searchService.blockUserFilter(this.chatHistoryList,this.userService.getOwnerId(),(list)=>{
              this.chatHistoryList = list;
              this.noChat = (this.chatHistoryList.length === 0);
            });
            this.chatHistoryList.map((chatHistory)=>{
              let userSub = this.userService.getUser(chatHistory.$key).subscribe(
                user => {
                  chatHistory.user = user;
                }
              );  
              this.userSubList.push(userSub);
            });
          }
        }
        loader.dismiss();
      }
    ); 
  }

  ngOnDestroy(){
    this.chatHistSub.unsubscribe();
    this.userSubList.map((userSub)=>{
      userSub.unsubscribe();
    });
  }

  goToProfile(uid){
    this.navCtrl.push('Profile',{
      uid:uid,
      is_owner: false
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Messages');
  }

  goToChat(uid){
    this.navCtrl.push('ChatDetails',{
      toUserUid:uid
    });
  }

}