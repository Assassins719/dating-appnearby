export class Search {

  title: string = '';
  location: string = 'all';
  distance: number = 1000;
  rating: number = 1;
  lookingFor:string;
  ageRange = {
    lower: 18,
    upper: 60
  };
  heightRange = {
    lower: 55,
    upper: 84
  };
  option = {
    photo: false,
    paid: false/* ,
    viewed: false,
    viewedMe: false,
    favorited: false,
    unviewed: false,
    favoritedMe: false */
  };
  otherLoc = '';
  bodyType = [];
  ethnicity = [];
  hairColor = [];
  smoking = [];
  drinking = [];
  relationship = [];
  education = [];

  constructor() {
  }


}