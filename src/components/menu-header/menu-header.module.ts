import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuHeader } from './menu-header';

@NgModule({
  declarations: [
    MenuHeader,
  ],
  imports: [
    IonicPageModule.forChild(MenuHeader),
  ],
  exports: [
    MenuHeader
  ]
})
export class MenuHeaderModule {}
