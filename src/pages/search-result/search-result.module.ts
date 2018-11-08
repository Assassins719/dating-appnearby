import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchResult } from './search-result';
import { MenuHeaderModule } from '../../components/menu-header/menu-header.module';
import { FooterButtonModule } from '../../components/footer-button/footer-button.module';
import { RatingModule } from '../../components/rating/rating.module.ts';
import { SearchModalModule } from '../search-modal/search-modal.module';
import { PlaceSearchModalPageModule } from '../place-search-modal/place-search-modal.module';

@NgModule({
  declarations: [
    SearchResult
  ],
  imports: [
    MenuHeaderModule,
    FooterButtonModule,
    RatingModule,
    SearchModalModule,
    PlaceSearchModalPageModule,
    IonicPageModule.forChild(SearchResult)
  ],
  exports: [
    SearchResult
  ]
})
export class SearchResultModule {}
