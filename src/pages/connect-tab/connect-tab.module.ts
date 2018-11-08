import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConnectTab } from './connect-tab';
import { RatingModule } from '../../components/rating/rating.module.ts';
import { MenuHeaderModule } from '../../components/menu-header/menu-header.module';
import { FooterButtonModule } from '../../components/footer-button/footer-button.module';

@NgModule({
  declarations: [
    ConnectTab,
  ],
  imports: [
    MenuHeaderModule,
    RatingModule,
    FooterButtonModule,
    IonicPageModule.forChild(ConnectTab),
  ],
  exports: [
    ConnectTab
  ]
})
export class ConnectTabModule {}
