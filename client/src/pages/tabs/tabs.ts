import { Component } from '@angular/core'
import { HomePage } from '../home/home'
import { callback_Page } from '../callback/callback'
import { call_history_Page} from '../call_history/call_history'
import {TasksPage} from '../tasks/tasks'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = HomePage
  tab2Root: any = callback_Page
  tab3Root: any = call_history_Page
  constructor() {}
}
