import { Component, NgZone } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { GeoService } from '../../providers/geo-service';

@Component({
  selector: 'page-place-search-modal',
  templateUrl: 'place-search-modal.html',
})
export class PlaceSearchModalPage {

  autocompleteItems;
  autocomplete;

  constructor(
    public viewCtrl: ViewController,
    public geoService: GeoService,
    private zone: NgZone
  ) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    this.geoService
      .autocompleteService
      .getPlacePredictions({
        input: this.autocomplete.query
      }, (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction.description);
          });
        });
      });
  }
}