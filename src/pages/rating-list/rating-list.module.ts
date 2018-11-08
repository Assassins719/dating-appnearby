import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingList } from './rating-list';
import { FooterButtonModule } from '../../components/footer-button/footer-button.module';
import { RatingModule } from '../../components/rating/rating.module.ts';

@NgModule({
  declarations: [
    RatingList,
  ],
  imports: [
    RatingModule,
    FooterButtonModule,
    IonicPageModule.forChild(RatingList),
  ],
  exports: [
    RatingList
  ]
})
export class RatingListModule {}
