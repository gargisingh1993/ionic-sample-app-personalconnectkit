import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { ModalController } from 'ionic-angular'
import { ToastController } from 'ionic-angular'
import { LoginModal } from '../../modal/login/login'
import { LogoutModal } from '../../modal/logout/logout'
import { editContact } from '../../modal/editContact/editContact'
import { AuthService } from '../../app/auth.service'
import { AddAvailability } from '../../modal/AddAvailability/AddAvailability'
import { IHome } from '../../app/home.interface'
import { home_Store } from '../../app/home.store'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public auth: AuthService,
    public home_Store: home_Store) { }

  doRefresh (refresher) {
    let subscription = this.home_Store.refresh().subscribe({
      complete: () => {
        subscription.unsubscribe()
        refresher.complete()
      }
    })
  }

   addAvail (index) {
    this.home_Store.addAvail(index).subscribe(home => {
      if (!home) { return console.log('Please check logs') }
      this.presentToast(`"${home}" was updated.`)
    })
  }

    deleteAvail (index) {
      console.log(index)
      index.Delete = 'True'
      console.log(index)
    this.home_Store.deleteAvail(index).subscribe(home => {
      if (!home) { return console.log('Please check logs') }
      this.presentToast(`"${home}" was updated.`)
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

  openModalavailability(){
    let modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? AddAvailability : LoginModal)
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

  get userColor ():string {
    return this.auth.isUserSignedIn() ? 'secondary' : 'primary'
  }
}
