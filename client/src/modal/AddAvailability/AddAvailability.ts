import { Component } from '@angular/core'
import { NavController, NavParams, ViewController } from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import { CognitoUser , CognitoUserAttribute } from 'amazon-cognito-identity-js'
import { ModalController } from 'ionic-angular'
import { ToastController } from 'ionic-angular'
import { home_Store } from '../../app/home.store'
import { IHome } from '../../app/home.interface'


@Component({
  selector: 'modal-logout',
  templateUrl: 'AddAvailability.html'
})

export class AddAvailability {

  user: CognitoUser
  attrs: Array<CognitoUserAttribute> = []
  data: Data = {}

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController, 
    public auth: AuthService, 
    private modalCtrl: ModalController, 
    private toastCtrl: ToastController,
    private home_Store: home_Store){
    //this.data = this.navParams.get('data')
  }

  ionViewDidLoad() {
    this.auth.getCredentials().subscribe(creds => {
      this.auth.cognitoUser['getUserAttributes']((err, results) => {
        if (err) { return console.log('err getting attrs', err) }
        this.attrs = results
      })
    })
  }


  AddAvailability (index) {
    this.home_Store.addAvail(index).subscribe(home => {
      if (!home_Store) { return console.log('could not delete task. Please check logs') }
      this.presentToast(`"${index}" was updated.`)
    })
  }

  AddAvailabilityEmpty(data){
    data.avail = 'true'
    data.Available = 'true'
    data.Events_Description = data.Description
    //console.log((data))
    this.home_Store.addAvail(data).subscribe(home => {
      if (!home_Store) { return console.log('could not delete task. Please check logs') }
      this.presentToast(`"${data}" was updated.`)
    })
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

  get size() { return this.home_Store.home.map((home) => home.size) }

  dismiss() { this.viewCtrl.dismiss() }

}

interface Data {
  avail?:string
  Available?: string
  Events?: string
  EndTimeStamp?: number
  Events_Description?: string
  StartTimeStamp?: number
  Description?: string
}
