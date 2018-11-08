import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchModal } from './search-modal';

@NgModule({
  declarations: [
    SearchModal,
  ],
  imports: [
    IonicPageModule.forChild(SearchModal),
  ],
  exports: [
    SearchModal
  ]
})
export class SearchModalModule {}
