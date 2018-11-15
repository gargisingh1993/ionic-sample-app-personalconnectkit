import { NgModule, ErrorHandler } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpModule } from '@angular/http'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import {Push} from '@ionic-native/push'
import { CallNumber } from '@ionic-native/call-number';
import { FormsModule } from '@angular/forms'

import { MyApp } from './app.component'

import { call_history_Page } from '../pages/call_history/call_history'
import { callback_Page } from '../pages/callback/callback'
import { HomePage } from '../pages/home/home'
import { TabsPage } from '../pages/tabs/tabs'
import { LoginModal } from '../modal/login/login'
import { LogoutModal } from '../modal/logout/logout'
import { editContact } from '../modal/editContact/editContact'
import { AddAvailability } from '../modal/AddAvailability/AddAvailability'
import { Analytics } from '../modal/Analytics/Analytics'

import { AwsConfig } from './app.config'
import { AuthService, AuthServiceProvider } from './auth.service'
import { call_history_Store, call_history_StoreProvider } from './call_history.store'
import { callback_Store, callback_StoreProvider } from './callback.store'
import { home_Store, home_StoreProvider } from './home.store'
import { editContact_Store, editContact_StoreProvider } from './editContact.store'
import { Sigv4Http, Sigv4HttpProvider } from './sigv4.service'

import { ChartsModule } from 'ng2-charts'
import { momentFromNowPipe } from './momentFromNow.pipe'

@NgModule({
  declarations: [
    MyApp,
    call_history_Page,
    callback_Page,
    HomePage,
    TabsPage,
    LoginModal,
    LogoutModal,
    Analytics,
    editContact,
    AddAvailability,
    momentFromNowPipe
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, new AwsConfig().load()),
    FormsModule,
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    call_history_Page,
    callback_Page,
    HomePage,
    TabsPage,
    LoginModal,
    LogoutModal,
    Analytics,
    editContact,
    AddAvailability
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    CallNumber,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService, AuthServiceProvider,
    call_history_Store,call_history_StoreProvider,
    callback_Store,callback_StoreProvider,
    home_Store,home_StoreProvider,
    editContact_Store,editContact_StoreProvider,
    Sigv4Http, Sigv4HttpProvider
  ]
})
export class AppModule {}
