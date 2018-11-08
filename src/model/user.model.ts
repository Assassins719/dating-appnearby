export class User {
	key:string;
	$key:string;

	email:string = '';
	phone:number = 0;
	userName:string = '';
	description:string = '';
	profilePicPath:string = '';
	picList:string[] = [];
	starRating:number = 0;
	dateOfBirth:string = '';
	gender:string = '';

	profileCompleted:boolean = false;
	
	profileCreationDate:number = Date.now();
	firstTimeLogin:boolean=false;
	isOnline:boolean = false;
	lastOnlineTime:Date;
	otp:any="";
	optGenerateTime:any="";
	is_phone_verified:any=false;
	push_id:any="";

	isPaidMember:boolean = true;
	subcriptionLastDate:number=1511293010712;
	subscriptionHistory = [];
	profileActive:boolean = true;
	profileDeactivateComment:string = '';
	distance:number;

	lookingFor:string = '';
	homePlace:string = '';
	currentPlace:string = '';
	homeLocation = {
		lat:0,
		lng:0
	};
	currentLocation = {
		lat:0,
		lng:0
	};
	height:number = 55;
	hairColor:string = '';
	age:number = 0;
	bodyType:string = '';
	ethnicity:string = '';
	smoking:string = '';
	drinking:string = '';
	education:string = '';
	occupation:string = '';
	relationship:string = '';
	children:string = '';
	// viwedMeCount:number = 0;
	// favoriteCount:number = 0;
	favoriteMeCount:number = 0;
	
	is_Activity_hidden:boolean=false;
	hideOnlineStatus:boolean=false;
	hideViewSomeone:boolean=false;
	hideFevSomeone:boolean=false;

	constructor(user?:any){
		// new Option()
		if(user) {
			this.email = user.email;
			this.phone = user.phone;
			this.userName = user.userName;
		}			
	}

	
}