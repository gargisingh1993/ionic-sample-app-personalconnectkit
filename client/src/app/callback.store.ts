import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/concatAll'
import 'rxjs/add/operator/share'
import { List } from 'immutable'
import { Icallback } from './callback.interface'
import { AuthService } from './auth.service'
import * as moment from 'moment'
import * as _orderBy from 'lodash.orderby'
import { Sigv4Http } from './sigv4.service'
import { Config } from 'ionic-angular'

let callback_StoreFactory = (sigv4: Sigv4Http, auth: AuthService, config: Config) => { return new callback_Store(sigv4, auth, config) }

export let callback_StoreProvider = {
  provide: callback_Store,
  useFactory: callback_StoreFactory,
  deps: [Sigv4Http, AuthService]
}

const displayFormat = 'YYYY-MM-DD'

@Injectable()
export class callback_Store {

  private _callback: BehaviorSubject<List<Icallback>> = new BehaviorSubject(List([]))
  private endpoint:string

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['contact-bot-api']
    this.auth.signoutNotification.subscribe(() => this._callback.next(List([])))
    this.auth.signinNotification.subscribe(() => this.refresh() )
    this.refresh()
  }

  get callback () { return Observable.create( fn => this._callback.subscribe(fn) ) }

  refresh () : Observable<any> {
    if (this.auth.isUserSignedIn()) {
      let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'get-contacts',{"TABLE":"TABLE_CONTACT_CALLBACK_REQUEST"}, creds)).concatAll().share()
      observable.subscribe(resp => {
        let data = resp.json()
        this.changeObject(data)
        this._callback.next(List(this.sort(data.call)))
      })
      return observable
    } else {
      this._callback.next(List([]))
      return Observable.from([])
    }
  }

  update_callback (index): Observable<Icallback> {
    let callback = this._callback.getValue().toArray()
    let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'initiate-callback', callback[index], creds)).concatAll().share()

    observable.subscribe(resp => {
      if (resp.status === 200) {
        callback.splice(index, 1)[0]
        this._callback.next(List(<Icallback[]>callback))
      }
      if(resp.status === 403){
        console.log("Some error here")
      }
    })
    return observable.map(resp => resp.status === 200 ? resp.json().task : null)
  }

  delete_callback (index): Observable<Icallback>{
  let callback = this._callback.getValue().toArray()
  this.convertTotimestamp(callback[index])
  let obs = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'remove-callback', callback[index], creds)).concatAll().share()

  obs.subscribe(resp => {
    if (resp.status === 200) {
      callback.splice(index, 1)[0]
      this._callback.next(List(<Icallback[]>callback))
    }
  })
  return obs.map(resp => resp.status === 200 ? resp.json().task : null)
}

  private changeObject(data){
    for(var i in data.call){
        data.call[i].CallbackRequestTime = new Date(data.call[i].CallbackRequestTime * 1000).toISOString()
    }
    return data
  }

  private convertTotimestamp(data){
    data.CallbackRequestTime = Date.parse(data.CallbackRequestTime)
    data.CallbackRequestTime = data.CallbackRequestTime/1000
    return data
  }

  private sort (callback:Icallback[]): Icallback[] {
    return _orderBy(callback, ['CallbackRequestTime'], ['desc'])
  }

}
