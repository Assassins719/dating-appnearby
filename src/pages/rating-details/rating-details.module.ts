import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingDetails } from './rating-details';
import { FooterButtonModule } from '../../components/footer-button/footer-button.module';
import { RatingModule } from '../../components/rating/rating.module.ts';

@NgModule({
  declarations: [
    RatingDetails,
  ],
  imports: [
    RatingModule,
    FooterButtonModule,
    IonicPageModule.forChild(RatingDetails),
  ],
  exports: [
    RatingDetails
  ]
})
export class RatingDetailsModule {}
