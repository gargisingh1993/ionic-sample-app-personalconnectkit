import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/concatAll'
import 'rxjs/add/operator/share'
import { List } from 'immutable'
import { Icall_history } from './call_history.interface'
import { AuthService } from './auth.service'
import * as moment from 'moment'
import * as _orderBy from 'lodash.orderby'
import { Sigv4Http } from './sigv4.service'
import { Config } from 'ionic-angular'

let call_history_StoreFactory = (sigv4: Sigv4Http, auth: AuthService, config: Config) => { return new call_history_Store(sigv4, auth, config) }

export let call_history_StoreProvider = {
  provide: call_history_Store,
  useFactory: call_history_StoreFactory,
  deps: [Sigv4Http, AuthService]
}

const displayFormat = 'YYYY-MM-DD'

@Injectable()
export class call_history_Store {

  private _call_history: BehaviorSubject<List<Icall_history>> = new BehaviorSubject(List([]))
  private endpoint:string

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['contact-bot-api']
    this.auth.signoutNotification.subscribe(() => this._call_history.next(List([])))
    this.auth.signinNotification.subscribe(() => this.refresh() )
    this.refresh()
  }

  get call_history () { return Observable.create( fn => this._call_history.subscribe(fn) ) }

  refresh () : Observable<any> {
    if (this.auth.isUserSignedIn()) {
      let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'get-contacts',{"TABLE":"TABLE_CONTACT_HISTORY"}, creds)).concatAll().share()
      observable.subscribe(resp => {
        let data = resp.json()
        this._call_history.next(List(this.sort(data.call)))
      })
      return observable
    } else {
      this._call_history.next(List([]))
      return Observable.from([])
    }
  }
  
  private sort (call_history:Icall_history[]): Icall_history[] {
    return _orderBy(call_history, ['Timestamp'], ['desc'])
  }
}
