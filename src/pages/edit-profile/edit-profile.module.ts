import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfile } from './edit-profile';
import { MenuHeaderModule } from '../../components/menu-header/menu-header.module';
import { FooterButtonModule } from '../../components/footer-button/footer-button.module';
import { CommonModule } from '../../pipes/common.module';

@NgModule({
  declarations: [
    EditProfile
  ],
  imports: [
    MenuHeaderModule,
    FooterButtonModule,
    IonicPageModule.forChild(EditProfile),
    CommonModule,
  ],
  exports: [
    EditProfile
  ]
})
export class EditProfileModule {}
