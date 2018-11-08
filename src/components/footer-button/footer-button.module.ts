import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FooterButton } from './footer-button';

@NgModule({
  declarations: [
    FooterButton,
  ],
  imports: [
    IonicPageModule.forChild(FooterButton),
  ],
  exports: [
    FooterButton
  ]
})
export class FooterButtonModule {}
