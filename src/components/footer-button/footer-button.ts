import { Component, OnInit, OnDestroy , Input} from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChatService } from '../../providers/chat-service';
import { UserService } from '../../providers/user-service';
import { User } from '../../model/user.model';
import {App} from 'ionic-angular';
@Component({
  selector: 'footer-button',
  templateUrl: 'footer-button.html'
})
export class FooterButton implements OnInit, OnDestroy{
  connectCount:Number;
  chatCount:Number;
  currentFooterItem:any;
  user:User;
  userSub:any;
  chatHistSub:any;

  @Input('pageTitle') pageTitle;

  constructor(
    public navCtrl: NavController, 
    public userService: UserService,
    public chatService: ChatService,
    private app: App
    ) {
    console.log('Hello FooterButton Component');
  }

  ngOnInit(){
    this.currentFooterItem=this.pageTitle;
    this.userSub = this.userService.getOwnerSub().subscribe( user => {
      this.user = user;
      this.connectCount = this.user.favoriteMeCount;
    });

    this.chatHistSub = this.chatService.getChatHistoryList().subscribe(
      snap => {
        if(snap.length !== 0){
          let chatHistoryList = snap;
          this.chatCount = 0;
          chatHistoryList.map((chatHistory)=>{
            this.chatCount += chatHistory.unreadChatCount;
          });
        }
      }
    ); 
    
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.chatHistSub.unsubscribe();
  }

  navigateToMessage(){
    console.log(this.navCtrl.getActive().name);
    this.currentFooterItem='Messages';
    this.navCtrl.setRoot('Messages');
  }
  navigateToSearch(){
    console.log(this.navCtrl.getActive().name);

    if(this.navCtrl.getActive().name!="SearchResult"){
      this.currentFooterItem="SearchResult";
      this.navCtrl.setRoot('SearchResult');
    }
    
  }
  navigateToConnect(){
    if(this.navCtrl.getActive().name!='ConnectTab'){
      this.currentFooterItem="ConnectTab";
      this.navCtrl.setRoot('ConnectTab');
      
    }
    
  }
  navigateToProfile(){
    this.currentFooterItem="Profile";
    this.navCtrl.setRoot('Profile',{
        is_owner:true,
        from_footer:true
    });

  }

}
