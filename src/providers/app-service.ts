import { Injectable } from '@angular/core';
// import { Http , RequestOptions , Headers} from '@angular/http';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Subject }    from 'rxjs/Subject';
import { statesList } from '../constants/states';
// import * as _ from 'lodash';

@Injectable()
export class AppService {

  constructor(public http: Http) {
    console.log('Hello AppService Provider');
  }

  // Observable string sources
  private setRouteSource = new Subject<any>();
 
 
  // Observable string streamss
  setRouteObj$ = this.setRouteSource.asObservable();
 
  // Service message commands
  setRoute(mission: any) {
    this.setRouteSource.next(mission);
  }

  getListOfStatesByCountry(country:any){
    
      return statesList[country]['states'];
  }
 


}
