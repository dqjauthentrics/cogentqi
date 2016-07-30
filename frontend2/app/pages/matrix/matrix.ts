import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";

@Component({
    templateUrl: 'build/pages/matrix/matrix.html',
})
export class MatrixPage {
    public matrix = {};

    constructor(private nav: NavController, assessmentData: AssessmentProvider) {
        /** @todo Greg? These need to be arguments */
        var organizationId: number = 3;
        var instrumentId: number = 5;

        assessmentData.loadMatrix(organizationId, instrumentId).then(matrix => {
            /** @todo Greg? This does retrieve the data correctly as it does in the Angular 1 version, but feel free to change it. */
            console.log("Retrieved matrix: ", matrix);
            this.matrix = matrix;
        });
    }

}
