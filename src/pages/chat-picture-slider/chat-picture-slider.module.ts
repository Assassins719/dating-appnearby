import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPictureSlider } from './chat-picture-slider';

@NgModule({
  declarations: [
    ChatPictureSlider,
  ],
  imports: [
    IonicPageModule.forChild(ChatPictureSlider),
  ],
  exports: [
    ChatPictureSlider
  ]
})
export class ChatPictureSliderModule {}
