import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadPic } from './upload-pic';

@NgModule({
  declarations: [
    UploadPic,
  ],
  imports: [
    IonicPageModule.forChild(UploadPic),
  ],
  exports: [
    UploadPic
  ]
})
export class UploadPicModule {}
