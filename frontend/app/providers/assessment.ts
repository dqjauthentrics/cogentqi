import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Config} from "./config";

@Injectable()
export class AssessmentProvider extends DataModel {

    constructor(protected http: Http, config: Config) {
        super('assessment', http, config);
    }

    loadMatrix(organizationId: number, instrumentId: number) {
        return new Promise(resolve => {
            this.http.get(this.baseUrl + '/matrix/' + organizationId + '/' + instrumentId).subscribe(res => {
                var jsonResponse = res.json();
                this.list = jsonResponse.data;
                resolve(this.list);
            });
        });
    }

}
