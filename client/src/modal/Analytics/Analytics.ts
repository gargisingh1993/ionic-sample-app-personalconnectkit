import { Component } from '@angular/core'
import { NavController, NavParams, ViewController } from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import { CognitoUser , CognitoUserAttribute } from 'amazon-cognito-identity-js'
import { ModalController } from 'ionic-angular'
import { ToastController } from 'ionic-angular'


@Component({
  selector: 'modal-logout',
  templateUrl: 'Analytics.html'
})

export class Analytics {

  user: CognitoUser
  attrs: Array<CognitoUserAttribute> = []
  data:string

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController, 
    public auth: AuthService, 
    private modalCtrl: ModalController, 
    private toastCtrl: ToastController){
    this.data = this.navParams.get('data')
    this.changeObject(this.data)
    //console.log(this.data)
  }

  ionViewDidLoad() {
    this.auth.getCredentials().subscribe(creds => {
      this.auth.cognitoUser['getUserAttributes']((err, results) => {
        if (err) { return console.log('err getting attrs', err) }
        this.attrs = results
      })
    })
  }

    private changeObject(data){
    if(data.Timestamp != null && !(typeof(data.Timestamp) =='string')){
        data.Timestamp = new Date(data.Timestamp * 1000).toISOString()
    }
    if(data.Analysis && !(typeof(data.Analysis) == 'object')){
      data.Analysis = JSON.parse(data.Analysis)
    }
    return data
  }

  presentToast(message) {
  let toast = this.toastCtrl.create({
    message: message,
    duration: 1500,
    position: 'bottom'
  })
  toast.onDidDismiss(() => { console.log('Dismissed toast') })
  toast.present()
  }

/*  get size() { return this.home_Store.home.map((home) => home.size) }*/

  dismiss() { this.viewCtrl.dismiss() }
}