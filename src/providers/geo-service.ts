import { Injectable } from '@angular/core';
// import { User } from './../model/user.model'
import { MapsAPILoader } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation';
import * as _ from "lodash";

declare var google: any;


@Injectable()
export class GeoService {
  geocoder:any;
  // geodistService:any;
  autocompleteService:any;

  constructor(
    public mapsAPILoader: MapsAPILoader, 
    private geolocation: Geolocation
  ) {
    this.mapsAPILoader.load().then(() => {
      // console.log('google script loaded');
      this.geocoder = new google.maps.Geocoder();
      this.autocompleteService = new google.maps.places.AutocompleteService();
    });
  }

  getCurrentLocGeo(){
    return this.geolocation.getCurrentPosition();
  }

  getCurrentLocFromGeo(latlng,cb){
    this.geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        let addrList = results[0].formatted_address.split(', ');
        let onlyTillCityAddrs = _.takeRight(addrList, 3).join(', ').replace(/ [\d]+/g,''); // removing the zip code
        console.log('onlyTillCityAddrs',onlyTillCityAddrs);
        cb(onlyTillCityAddrs);
      } else {
        console.log('Location not found');
        cb('');
      }
    });
  }

  getGeoFromLoc(address,cb){
    this.geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        console.log('MMMAAAPPP',results);
        if(results[0]){
          console.log('results[0].geometry.location',results[0].geometry.location);
          let location = results[0].geometry.location
          cb({
            lat:location.lat(),
            lng:location.lng()
          });
        }
      } else {
        console.log('Address not found');
        cb(undefined);
      }
    });
  }

  distance(latlng1, latlng2/* , unit */) {
    let dist = 0;
    if(latlng1 && latlng2){
      let lat1 = latlng1.lat,
          lon1 = latlng1.lng, 
          lat2 = latlng2.lat, 
          lon2 = latlng2.lng;
      let radlat1 = Math.PI * lat1/180
      let radlat2 = Math.PI * lat2/180
      let theta = lon1-lon2
      let radtheta = Math.PI * theta/180
      dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515 // default in miles
      // if (unit=="K") { dist = dist * 1.609344 }
      // if (unit=="N") { dist = dist * 0.8684 }
    }
    return dist; 
  /* 
    this.geodistService.getDistanceMatrix({
        origins: [latlng1],
        destinations: [latlng2]
    }, function (response, status) {
        if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
            var distance = response.rows[0].elements[0].distance.text;
            var duration = response.rows[0].elements[0].duration.text;
            var dvDistance = document.getElementById("dvDistance");
           dvDistance.innerHTML = "";
            dvDistance.innerHTML += "Distance: " + distance + "<br />";
            dvDistance.innerHTML += "Duration:" + duration;
 
        } else {
            alert("Unable to find the distance via road.");
        }
    });
 */
  }

}