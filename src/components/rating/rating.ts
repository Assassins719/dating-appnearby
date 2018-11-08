import { Component , Input , OnInit, OnChanges, SimpleChange} from '@angular/core';

@Component({
  selector: 'rating',
  templateUrl: 'rating.html'
})
export class Rating implements  OnInit, OnChanges {

  @Input('rating') ratingInput;
  maxRating:number;
  ratingList:any;
  text: string;
  
  changeLog: string[] = [];
  
  constructor() {

  }

  ngOnInit(){
    this.maxRating=5;
    this.ratingList=[];
    for(let i=0; i<this.maxRating; i++){
      if(this.ratingInput>i){
        this.ratingList.push(true);
      }else{
        this.ratingList.push(false);
      }
    }
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.ratingList=[];
    for(let i=0; i<this.maxRating; i++){
      if(this.ratingInput>i){
        this.ratingList.push(true);
      }else{
        this.ratingList.push(false);
      }
    }
  }

}
