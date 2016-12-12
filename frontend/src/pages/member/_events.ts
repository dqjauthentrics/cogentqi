import {Component, Input} from "@angular/core";

@Component({
    selector: 'member-events-card',
    templateUrl: '_events.html'
})

export class MemberEventsCard {
    @Input() events: any[];

    public rowsOnPage = 3;
    public sortBy = "orderedOn";
    public sortOrder = "desc";
}
