import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'toggler',
    templateUrl: 'toggler.html'
})

export class Toggler {
    @Input() disabled: boolean = false;
    @Input() defaultState: string = 'collapsed';
    @Output() collapsedChange = new EventEmitter();

    collapsedValue: boolean = (this.defaultState == 'collapsed');

    @Input()
    get collapsed() {
        return this.collapsedValue;
    }

    set collapsed(val) {
        this.collapsedValue = val;
        this.collapsedChange.emit(this.collapsedValue);
    }

    namify() {
        let isCollapsed = this.collapsedValue == true ? true : (this.collapsedValue == false? false : (this.defaultState == 'collapsed'));
        return 'arrow-drop' + (isCollapsed ? 'right' : 'down') + '-circle';
    }

    toggle() {
        if (!this.disabled) {
            this.collapsedValue = !this.collapsedValue;
            this.collapsedChange.emit(this.collapsedValue);
        }
    }
}
