import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaceSearchModalPage } from './place-search-modal';

@NgModule({
  declarations: [
    PlaceSearchModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PlaceSearchModalPage),
  ],
  exports: [
    PlaceSearchModalPage
  ]
})
export class PlaceSearchModalPageModule {}
