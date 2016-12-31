import {App} from "ionic-angular";
import {Component} from "@angular/core";

@Component({
    templateUrl: 'app-page.html',
})
export class AppPage {
    constructor(protected _app: App) {
        this._app.setTitle("App Name");
    }

    ngOnInit() {
        this._app.setTitle("App Name");
    }
}