import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'rubric',
    templateUrl: 'rubric.html',
})

export class Rubric {
    @Output() onChange: EventEmitter<any> = new EventEmitter();
    @Input() question;
    @Input() enabled = true;

    cellWidth() {
        if (this.question && this.question.choices) {
            return (this.question.type.choices.length / 100) + '%';
        }
        return '20%';
    }

    setResponse(value) {
        if (this.enabled) {
            this.question.response = value;
            this.onChange.emit();
        }
    }

}
