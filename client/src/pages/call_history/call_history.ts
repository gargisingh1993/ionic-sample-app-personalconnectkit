import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { ModalController } from 'ionic-angular'
import { ToastController } from 'ionic-angular'
import { AuthService } from '../../app/auth.service'
import { call_history_Store } from '../../app/call_history.store'
import { Icall_history} from '../../app/call_history.interface'
import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { editContact } from '../../modal/editContact/editContact'
import { Analytics } from '../../modal/Analytics/Analytics'

@Component({
  selector: 'page-tasks',
  templateUrl: 'call_history.html'
})
export class call_history_Page {

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private auth: AuthService,
    private call_history_Store: call_history_Store
  ) {}

  ionViewDidLoad() {}

  doRefresh (refresher) {
    let subscription = this.call_history_Store.refresh().subscribe({
      complete: () => {
        subscription.unsubscribe()
        refresher.complete()
      }
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

  openModalAnalytics(idx){
    let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? Analytics : LoginModal, {'data' : idx})
    modal.present()
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

  get size() { return this.call_history_Store.call_history.map((call_history) => call_history.size) }
}
