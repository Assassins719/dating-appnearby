import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Pages 
import { SearchResultModule } from '../pages/search-result/search-result.module';
import { PictureSliderModule } from '../pages/picture-slider/picture-slider.module';
import { ChatPictureSliderModule } from '../pages/chat-picture-slider/chat-picture-slider.module';
import { IntroModule } from '../pages/intro/intro.module';
import { VerificationModule } from '../pages/verification/verification.module';
import { FooterButtonModule } from '../components/footer-button/footer-button.module';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { Verification } from '../pages/verification/verification';

//Component and service 
import { Intro } from '../pages/intro/intro';
import { AppService } from '../providers/app-service';
import { AuthService } from '../providers/auth-service';
import { ChatService } from '../providers/chat-service';
import { UserService } from '../providers/user-service';
import { SearchService } from '../providers/search-service';
import { GeoService } from '../providers/geo-service';
import { firebaseConfig } from '../constants/firebase-config';
import { appConfig } from '../constants/app-config';

// ionic native camera module add 
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { PayPal } from '@ionic-native/paypal';
import { FCM } from '@ionic-native/fcm';

import { Storage } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { RatingModule } from '../components/rating/rating.module.ts';

//Google Map
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    MyApp,
    LoginPage
  ],
  imports: [
    BrowserModule,
    SearchResultModule,
    IntroModule,
    VerificationModule,
    PictureSliderModule,
    ChatPictureSliderModule,
    FooterButtonModule,
    HttpModule,
    RatingModule,
    IonicModule.forRoot(MyApp,{
      tabsPlacement: 'top'
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot({
      apiKey: appConfig.gMapApiKey,
      libraries: ["places"]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    Verification,
    Intro
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppService,
    UserService,
    SearchService,
    GeoService,
    ChatService,
    AuthService,
    Camera,
    Geolocation,
    Storage,
    PayPal,
    FCM,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
