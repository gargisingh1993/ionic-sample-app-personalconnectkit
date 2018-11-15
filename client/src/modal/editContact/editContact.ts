import { Component } from '@angular/core'
import { NavController, NavParams, ViewController } from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import { CognitoUser , CognitoUserAttribute } from 'amazon-cognito-identity-js'
import { ModalController } from 'ionic-angular'
import { ToastController } from 'ionic-angular'
import { editContact_Store } from '../../app/editContact.store'
import { IeditContact} from '../../app/editContact.interface'
import { LoginModal } from '../../modal/login/login'

@Component({
  selector: 'modal-logout',
  templateUrl: 'editContact.html'
})

export class editContact {

  user: CognitoUser
  attrs: Array<CognitoUserAttribute> = []

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController, 
    public auth: AuthService, 
    private modalCtrl: ModalController, 
    private toastCtrl: ToastController,
    private editContact_Store: editContact_Store){}

  ionViewDidLoad() {
    this.auth.getCredentials().subscribe(creds => {
      this.auth.cognitoUser['getUserAttributes']((err, results) => {
        if (err) { return console.log('err getting attrs', err) }
        this.attrs = results
      })
    })
  }

  doRefresh (refresher) {
    let subscription = this.editContact_Store.refresh().subscribe({
      complete: () => {
        subscription.unsubscribe()
        refresher.complete()
      }
    })
  }

  updateContact (index) {
    this.editContact_Store.updateContact(index).subscribe(task => {
      if (!editContact) { return console.log('could not delete task. Please check logs') }
      this.presentToast(`"${editContact}" was updated.`)
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

  get size() { return this.editContact_Store.editContact.map((editContact) => editContact.size) }

  dismiss() { this.viewCtrl.dismiss() }
}
