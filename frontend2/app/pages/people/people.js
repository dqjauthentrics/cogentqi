import {Page, NavController} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/people/people.html',
})
export class peopleRoot {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
  }
}
