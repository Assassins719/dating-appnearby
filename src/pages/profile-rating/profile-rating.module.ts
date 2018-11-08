import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileRating } from './profile-rating';
import { FooterButtonModule } from '../../components/footer-button/footer-button.module';
import { RatingModule } from '../../components/rating/rating.module.ts';

@NgModule({
  declarations: [
    ProfileRating,
  ],
  imports: [
    RatingModule,
    FooterButtonModule,
    IonicPageModule.forChild(ProfileRating),
  ],
  exports: [
    ProfileRating
  ]
})
export class ProfileRatingModule {}
