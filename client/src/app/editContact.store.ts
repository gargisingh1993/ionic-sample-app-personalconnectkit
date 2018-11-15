import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/concatAll'
import 'rxjs/add/operator/share'
import { List } from 'immutable'
import { IeditContact } from './editContact.interface'
import { AuthService } from './auth.service'
import * as moment from 'moment'
import * as _orderBy from 'lodash.orderby'
import { Sigv4Http } from './sigv4.service'
import { Config } from 'ionic-angular'

let editContact_StoreFactory = (sigv4: Sigv4Http, auth: AuthService, config: Config) => { return new editContact_Store(sigv4, auth, config) }

export let editContact_StoreProvider = {
  provide: editContact_Store,
  useFactory: editContact_StoreFactory,
  deps: [Sigv4Http, AuthService]
}

const displayFormat = 'YYYY-MM-DD'

@Injectable()
export class editContact_Store {

  private _editContact: BehaviorSubject<List<IeditContact>> = new BehaviorSubject(List([]))
  private endpoint:string

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['contact-bot-api']
    this.auth.signoutNotification.subscribe(() => this._editContact.next(List([])))
    this.auth.signinNotification.subscribe(() => this.refresh() )
    this.refresh()
  }

  get editContact () { return Observable.create( fn => this._editContact.subscribe(fn) ) }

  refresh () : Observable<any> {
    if (this.auth.isUserSignedIn()) {
      let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'get-contacts',{"TABLE":"TABLE_CONTACTS"}, creds)).concatAll().share()
      observable.subscribe(resp => {
        //console.log(resp)
        let data = resp.json()
        this._editContact.next(List(this.sort(data.call)))
      })
      return observable
    } else {
      this._editContact.next(List([]))
      return Observable.from([])
    }
  }

  updateContact (index): Observable<IeditContact> {
    let editContact = this._editContact.getValue().toArray()
    editContact[index].ContactId = editContact[index].ContactId.replace(/\s/g, '')
    //console.log(editContact[index].ContactId)
    let obs = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'update-contact', editContact[index], creds)).concatAll().share()

    obs.subscribe(resp => {
      if (resp.status === 200) {
        editContact.splice(index, 1)[0]
        this._editContact.next(List(<IeditContact[]>editContact))
      }
    })
    this.refresh()
    return obs.map(resp => resp.status === 200 ? resp.json().task : null)
  }

  private sort (editContact:IeditContact[]): IeditContact[] {
    return _orderBy(editContact, ['ContactName'], ['asc'])
  }
}
