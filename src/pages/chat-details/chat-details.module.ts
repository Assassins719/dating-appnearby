import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatDetails } from './chat-details';
import { MenuHeaderModule } from '../../components/menu-header/menu-header.module';

@NgModule({
  declarations: [
    ChatDetails,
  ],
  imports: [
    MenuHeaderModule,
    IonicPageModule.forChild(ChatDetails),
  ],
  exports: [
    ChatDetails
  ]
})
export class ChatDetailsModule {}
