import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Contactus } from './contactus';
import { MenuHeaderModule } from '../../components/menu-header/menu-header.module';
import { FooterButtonModule } from '../../components/footer-button/footer-button.module';

@NgModule({
  declarations: [
    Contactus,
  ],
  imports: [
    MenuHeaderModule,
    FooterButtonModule,
    IonicPageModule.forChild(Contactus),
  ],
  exports: [
    Contactus
  ]
})
export class ContactusModule {}
