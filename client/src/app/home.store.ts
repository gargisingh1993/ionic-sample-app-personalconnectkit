import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/concatAll'
import 'rxjs/add/operator/share'
import { List } from 'immutable'
import { IHome } from './home.interface'
import { AuthService } from './auth.service'
import * as moment from 'moment'
import * as _orderBy from 'lodash.orderby'
import { Sigv4Http } from './sigv4.service'
import { Config } from 'ionic-angular'

let home_StoreFactory = (sigv4: Sigv4Http, auth: AuthService, config: Config) => { return new home_Store(sigv4, auth, config) }

export let home_StoreProvider = {
  provide: home_Store,
  useFactory: home_StoreFactory,
  deps: [Sigv4Http, AuthService]
}

const displayFormat = 'YYYY-MM-DD'

@Injectable()
export class home_Store {

  private _home: BehaviorSubject<List<IHome>> = new BehaviorSubject(List([]))
  private endpoint:string
  private datetime:string

  constructor (private sigv4: Sigv4Http, private auth: AuthService, private config: Config) {
    this.endpoint = this.config.get('APIs')['contact-bot-api']
    this.auth.signoutNotification.subscribe(() => this._home.next(List([])))
    this.auth.signinNotification.subscribe(() => this.refresh() )
    this.refresh()
  }

  get home () { return Observable.create( fn => this._home.subscribe(fn) ) }

  refresh () : Observable<any> {
    if (this.auth.isUserSignedIn()) {
      let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'get-availability',{}, creds)).concatAll().share()
      observable.subscribe(resp => {
        let data = resp.json()
        this.changeObject(data)
        this._home.next(List(this.sort(data)))
        //console.log(data)
      })
      return observable
    } else {
      this._home.next(List([]))
      return Observable.from([])
    }
  }

  addAvail (avail): Observable<IHome> {
    this.convertTotimestamp(avail)
    let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'put-availability', avail, creds)).concatAll().share()

    observable.subscribe(resp => {
      if (resp.status === 200) {
        this.refresh()
      }
    })
    return observable.map(resp => resp.status === 200 ? resp.json().avail : null)
  }

  deleteAvail (avail): Observable<IHome> {
    this.convertTotimestamp(avail)
    let observable = this.auth.getCredentials().map(creds => this.sigv4.post(this.endpoint, 'put-availability', avail, creds)).concatAll().share()

    observable.subscribe(resp => {
      if (resp.status === 200) {
        this.refresh()
      }
    })
    return observable.map(resp => resp.status === 200 ? resp.json().avail : null)
  }

  changeObject(data){
    for(var i in data.avail.Events){
        data.avail.Events[i].StartTimeStamp = new Date(data.avail.Events[i].StartTimeStamp * 1000).toISOString()
        data.avail.Events[i].EndTimeStamp = new Date(data.avail.Events[i].EndTimeStamp * 1000).toISOString()
    }
    return data
  }

  convertTotimestamp(avail){
    avail.StartTimeStamp = Date.parse(avail.StartTimeStamp)
    avail.StartTimeStamp = avail.StartTimeStamp/1000
    avail.EndTimeStamp = Date.parse(avail.EndTimeStamp)
    avail.EndTimeStamp = avail.EndTimeStamp/1000
    return avail
  }


  private sort (home:IHome[]): IHome[] {
    return _orderBy(home, ['EndTimeStamp', 'StartTimeStamp'], ['asc', 'asc'])
  }
}
