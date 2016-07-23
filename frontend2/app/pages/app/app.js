import {Page} from 'ionic-angular';
import {dashboardRoot} from '../dashboard/dashboard';
import {peopleRoot} from '../people/people';
import {resourcesRoot} from '../resources/resources';

@Page({
  templateUrl: 'build/pages/app/app' +
  '.html'
})
export class AppPage {
  constructor() {
    this.dashboardRoot = dashboardRoot;
    this.peopleRoot = peopleRoot;
    this.resourcesRoot = resourcesRoot;
  }
}