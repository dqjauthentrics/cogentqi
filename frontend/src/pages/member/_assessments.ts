import {Component, Input} from "@angular/core";

@Component({
    selector: 'member-assessments-card',
    templateUrl: '_assessments.html'
})

export class MemberAssessmentsCard {
    @Input() assessments: any[];

    public filterQuery = "";
    public rowsOnPage = 3;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor() {
    }

    sortName(event: any) {
        return event.name;
    }

    sortCategory(event: any) {
        return event.category;
    }

}
