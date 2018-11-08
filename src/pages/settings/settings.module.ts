import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Settings } from './settings';
import { FooterButtonModule } from '../../components/footer-button/footer-button.module';
import { MenuHeaderModule } from '../../components/menu-header/menu-header.module';

@NgModule({
  declarations: [
    Settings,
  ],
  imports: [
    FooterButtonModule,
    MenuHeaderModule,
    IonicPageModule.forChild(Settings),
  ],
  exports: [
    Settings
  ]
})
export class SettingsModule {}
