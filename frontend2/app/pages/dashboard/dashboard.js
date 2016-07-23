//import {Component} from '@angular/core';
import {Page, NavController} from "ionic-angular";
import {MatrixPage} from "../evaluations/matrix"

@Page({
		  templateUrl: 'build/pages/dashboard/dashboard.html',
	  })
//@Component({
//			   template: `<button [navPush]="pushPage"></button>`
//		   })
export class dashboardRoot {
	static get parameters() {
		return [[NavController]];
	}

	constructor(nav) {
		this.pushPage = MatrixPage;
		this.nav = nav;
	}
}
