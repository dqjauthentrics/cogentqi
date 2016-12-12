import {Component, Input} from "@angular/core";

@Component({
    selector: 'assessment-item',
    templateUrl: '_item.html'
})

export class AssessmentItem {
    @Input() assessment: any;
    @Input() showMember: boolean = true;
    @Input() showIcon: boolean = true;
}