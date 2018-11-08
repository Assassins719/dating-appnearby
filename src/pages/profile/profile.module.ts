import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Profile } from './profile';
import { MenuHeaderModule } from '../../components/menu-header/menu-header.module';
import { FooterButtonModule } from '../../components/footer-button/footer-button.module';
import { CommonModule } from '../../pipes/common.module';
import { RatingModule } from '../../components/rating/rating.module.ts';

@NgModule({
  declarations: [
    Profile
  ],
  imports: [
    MenuHeaderModule,
    FooterButtonModule,
    RatingModule,
    IonicPageModule.forChild(Profile),
    CommonModule
  ],
  exports: [
    Profile
  ]
})
export class ProfileModule {}
