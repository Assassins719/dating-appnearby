import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Messages } from './messages';
import { MenuHeaderModule } from '../../components/menu-header/menu-header.module';
import { FooterButtonModule } from '../../components/footer-button/footer-button.module';

@NgModule({
  declarations: [
    Messages,
  ],
  imports: [
    FooterButtonModule,
    MenuHeaderModule,
    IonicPageModule.forChild(Messages),
  ],
  exports: [
    Messages
  ]
})
export class MessagesModule {}
