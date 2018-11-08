import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UseApp } from './use-app';
import { MenuHeaderModule } from '../../components/menu-header/menu-header.module';
import { FooterButtonModule } from '../../components/footer-button/footer-button.module';

@NgModule({
  declarations: [
    UseApp,
  ],
  imports: [
    MenuHeaderModule,
    FooterButtonModule,
    IonicPageModule.forChild(UseApp),
  ],
  exports: [
    UseApp
  ]
})
export class UseAppModule {}
