import {Pipe, PipeTransform} from "@angular/core";
import {IconProvider} from "../providers/icon";

@Pipe({name: "icon"})

export class Icon implements PipeTransform {
    constructor(private icon: IconProvider) {

    }

    transform(standardName: string): string {
        let iconClass = this.icon.getClass(standardName);
        iconClass = iconClass.replace('ion-ios-', '');
        return iconClass;
    }
}
