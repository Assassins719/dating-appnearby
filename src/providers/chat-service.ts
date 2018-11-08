import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ChatHistory } from './../model/chatHistory.model'
import { Chat } from './../model/chat.model'
import { UserService } from './user-service'

@Injectable()
export class ChatService {
  
  constructor(
    public af: AngularFireDatabase,
    public userService:UserService
  ) {
    
  }

  // newChatHistory(chatKey:string,uid:string){
  //   this.af.database.ref('/chatHistory/'+uid+'/'+this.userService.getOwnerId()).set(new ChatHistory(chatKey));
  //   this.af.database.ref('/chatHistory/'+this.userService.getOwnerId()+'/'+uid).set(new ChatHistory(chatKey));
  // }

  getNewChatKey():string{
    let chatKey = Date.now().toString() + this.userService.getOwnerId();
    return chatKey;
  }

  getChatHistory(uid:string){
    return this.af.object('/chatHistory/'+this.userService.getOwnerId()+'/'+uid);
  }
  getChatHistoryRef(uid:string){
    return this.af.database.ref('/chatHistory/'+this.userService.getOwnerId()+'/'+uid);
  }
  getChatHistoryList(){
    return this.af.list('/chatHistory/'+this.userService.getOwnerId());
  }

  appendChat(uid:string, chatKey:string, chat:Chat, newChat:boolean){
    let chatTree = this.af.list('/chats/'+chatKey);
    chatTree.push(chat);
    let ownerId=this.userService.getOwnerId();
    let receiverChatHistRef = this.af.database.ref('/chatHistory').child(uid).child(this.userService.getOwnerId());
    let senderChatHistRef = this.af.database.ref('/chatHistory').child(ownerId).child(uid);
    receiverChatHistRef.once('value').then((obj)=>{
      let newObj:ChatHistory;
      if(newChat){
        newObj = new ChatHistory(chatKey);
      } else {
        newObj = obj.val();
      }      
      newObj.lastChatTime = chat.sendingTime;
      newObj.lastChatType = chat.chatType;
      newObj.receiverUID = uid;
      newObj.senderId = ownerId;
      if(chat.chatType === 'Text'){
        newObj.lastChatText = chat.content;
      } else {
        newObj.lastChatText = 'Send image...';
      }
      newObj.unreadChatCount++;
      if(newChat){
        receiverChatHistRef.set(newObj);
      } else {
        receiverChatHistRef.update(newObj);
      }            
    });
    senderChatHistRef.once('value').then((obj)=>{
      let newObj:ChatHistory;
      if(newChat){
        newObj = new ChatHistory(chatKey);
      } else {
        newObj = obj.val();
      }     
      newObj.lastChatTime = chat.sendingTime;
      newObj.lastChatType = chat.chatType;
      newObj.receiverUID = "";
      newObj.senderId=ownerId;
      newObj.chatLink = chatKey;      
      if(chat.chatType === 'Text'){
        newObj.lastChatText = chat.content;
      } else {
        newObj.lastChatText = 'Send image...';
      }
      if(newChat){
        senderChatHistRef.set(newObj);
      } else {
        senderChatHistRef.update(newObj);
      }      
    });
  }

  resetChatCount(uid:string){
    let senderChatHistRef = this.af.database.ref('/chatHistory').child(this.userService.getOwnerId()).child(uid);
    senderChatHistRef.once('value').then((obj)=>{
      let newObj = obj.val();
      newObj.unreadChatCount = 0;
      senderChatHistRef.update(newObj);
    });
  }

  getChatList(chatKey:string){
    return this.af.list('/chats/'+chatKey,{
      query:{
        orderByChild: 'sendingTime'
      }
    });
  }
}
