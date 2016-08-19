import {Component, Input} from "@angular/core";

@Component({
    selector: '<app-icon></app-icon>',
    template: `<ion-icon role="img" [class]="getClass(name)"></ion-icon>`
})

export class AppIcon {
    @Input() name: string = "cog";

    getClass(name: string): string {
        let className: string = name;
        let isAwesome = false;
        switch (name) {
            case 'logout':
                className = 'power';
                break;
            case 'help':
                className = 'help';
                break;
            case 'dashboard':
                className = 'pulse';
                break;
            case 'people':
                className = 'people';
                break;
            case 'level-up':
                isAwesome = true;
                break;
            case 'level-down':
                isAwesome = true;
                break;
            case 'organization':
            case 'organizations':
                className = 'sitemap';
                isAwesome = true;
                break;
            case 'member':
                className = 'person';
                break;
            case 'resources':
            case 'resource':
                className = 'school';
                break;
            case 'assessments':
            case 'assessment':
                className = 'options';
                break;
            case 'pdf':
                isAwesome = true;
                className = 'file-pdf-o';
                break;
        }
        if (isAwesome) {
            className = 'fa fa-' + className + '';
        }
        else {
            className = 'ion-ios-' + className;
        }
        return className;
    }
}
