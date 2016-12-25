import {Component, Output, EventEmitter} from "@angular/core";
import {IconProvider} from "../providers/icon";

@Component({
    selector: 'editor-button-bar',
    templateUrl: 'editor-button-bar.html'
})

export class EditorButtonBar {
    @Output() onSave: EventEmitter<any> = new EventEmitter();
    @Output() onRemove: EventEmitter<any> = new EventEmitter();

    constructor(public icon: IconProvider) {
    }

    save(record: any): void {
        this.onSave.emit(record);
    }

    remove(record: any): void {
        this.onRemove.emit(record);
    }
}
