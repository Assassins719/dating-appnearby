export class ChatHistory {

	lastChatText:string = '';
	lastChatType:string;
	lastChatTime:number;
    chatLink:string;
    unreadChatCount:number = 0;
	$key:string;
	user:string;
	receiverUID:string;
	senderId:string;

	constructor(key){
        this.chatLink = key;
	}
}