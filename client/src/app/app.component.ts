import { Component } from '@angular/core';
import { Config, Platform, Nav, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import { AuthService } from './auth.service'
import { Sigv4Http } from './sigv4.service'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/concatAll'
import 'rxjs/add/operator/share'



export let app_Provider = {
  deps: [Sigv4Http, AuthService]
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  private endpoint:string
  rootPage:any = TabsPage;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              public push: Push,
              public alertCtrl: AlertController,
              private sigv4: Sigv4Http,
              private auth: AuthService,
              private config: Config) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.initPushNotification();

    });
    this.endpoint = this.config.get('APIs')['contact-bot-api']
  }

  initPushNotification(){
  const options: PushOptions = {
    android: {
      senderID: "*************" //GCM sender ID for push notifications
    }
  };

  const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log("device token:", data.registrationId);

      let alert = this.alertCtrl.create({
                  title: 'device token',
                  subTitle: data.registrationId,
                  buttons: ['OK']
                });
                alert.present();

    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message', data.message);
      if (data.additionalData.foreground) {
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [
          {
            text: 'Ignore',
            handler: () => {
              let value = {
                'ContactId':data.message,
                'Response':'deny'
              }
              console.log(value)
            }
          }, {
            text: 'Pickup',
            handler: () => {
              let value = {
                'ContactId':data.message,
                'Response':'allow'
              }
              this.trigger(value);
            }
          }]
        });
        confirmAlert.present();
      } else {
      let alert = this.alertCtrl.create({
                  title: 'clicked on',
                  subTitle: "you clicked on the notification!",
                 buttons: ['OK']
                });
                alert.present();
        console.log("Push notification clicked");
      }
   });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  trigger(value){ 
    console.log(value.Response)
    let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'allow-call', value , creds)).concatAll().share()
     observable.subscribe(resp => {
      if (resp.status === 200) {
        console.log(resp)
      }
      if(resp.status != 200){
        console.log("Some error here")
        console.log(resp.status)
      }
    })
  }
}