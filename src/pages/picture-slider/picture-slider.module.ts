import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PictureSlider } from './picture-slider';

@NgModule({
  declarations: [
    PictureSlider,
  ],
  imports: [
    IonicPageModule.forChild(PictureSlider),
  ],
  exports: [
    PictureSlider
  ]
})
export class PictureSliderModule {}
