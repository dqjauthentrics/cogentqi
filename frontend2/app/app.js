import {App, Platform, IonicApp, MenuController} from "ionic-angular";
import {StatusBar} from "ionic-native";
import {AppPage} from "./pages/app/app";
import {SettingsPage} from "./pages/settings/settings";
import {ProfilePage} from "./pages/profile/profile";
import {MatrixPage} from "./pages/evaluations/matrix";

@App({
		 templateUrl: 'build/app.html',
		 config: {
			 tabbarPlacement: 'bottom'
		 }
	 })
export class MyApp {
	static get parameters() {
		return [
			[IonicApp],
			[Platform],
			[MenuController]
		];
	}

	constructor(app, platform, menu) {
		// set up our app
		this.app = app;
		this.platform = platform;
		this.menu = menu;
		this.initializeApp();

		this.pages = [
			{title: 'Dashboard', component: AppPage},
			{title: 'My Account', component: ProfilePage},
			{title: 'Settings', component: SettingsPage},
			{title: 'Matrix', component: MatrixPage}
		];

		this.rootPage = AppPage;
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			StatusBar.styleDefault();
		});
	}

	openPage(page) {
		this.menu.close()
		let nav = this.app.getComponent('nav');
		nav.setRoot(page.component);
	}
}
