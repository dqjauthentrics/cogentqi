import {Page, NavController} from "ionic-angular";

@Page({
		  templateUrl: 'build/pages/evaluations/matrix.html',
	  })
export class MatrixPage {
	static get parameters() {
		return [[NavController]];
	}

	constructor(nav) {
		this.nav = nav;
	}
}
