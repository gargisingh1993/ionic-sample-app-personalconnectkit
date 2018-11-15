import { CallNumber } from '@ionic-native/call-number';
import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { ModalController } from 'ionic-angular'
import { ToastController } from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import { callback_Store } from '../../app/callback.store'
import { Icallback} from '../../app/callback.interface'
import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { editContact } from '../../modal/editContact/editContact'

@Component({
  selector: 'page-tasks',
  templateUrl: 'callback.html'
})
export class callback_Page {

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private auth: AuthService,
    private callback_Store: callback_Store,
    private callNumber: CallNumber
  ) {}

  ionViewDidLoad() {}

  doRefresh (refresher) {
    let subscription = this.callback_Store.refresh().subscribe({
      complete: () => {
        subscription.unsubscribe()
        refresher.complete()
      }
    })
  }
  delete_callback (index) {
    this.callback_Store.delete_callback(index).subscribe(callback => {
      if (!callback) { return console.log('could not delete task. Please check logs') }
      this.presentToast(`"${callback.ContactId}" was deleted.`)
    })
  }

  update_callback (index) {
    this.callback_Store.update_callback(index).subscribe(callback => {
      if (!callback) { return console.log('could not initiate callback. Please check logs') }
      this.presentToast(`"${callback_Store}" call initated.`)
    })
  }

  openModal () {
    let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? LogoutModal : LoginModal)
    modal.present()
  }

  openModalcontact () {
    let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? editContact : LoginModal)
    modal.present()
  }

//Use this method to open a dialer directly in android mode of Ionic application.

/*  OpenDialer(value){
  this.callNumber.callNumber(value, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
  }*/

  
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    })
    toast.onDidDismiss(() => { console.log('Dismissed toast') })
    toast.present()
  }
  get size() { return this.callback_Store.callback.map((callback) => callback.size) }

}
