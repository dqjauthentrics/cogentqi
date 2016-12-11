import {Injectable} from "@angular/core";

@Injectable()
export class IconProvider {

    getClass(name: string): string {
        let className: string = name;
        let isAwesome = false;
        switch (name) {
            case 'assessments':
            case 'assessment':
                className = 'options';
                break;
            case 'dashboard':
                className = 'pulse';
                break;
            case 'event':
            case 'events':
                className = 'warning';
                break;
            case 'help':
                className = 'information-circle';
                break;
            case 'instrument':
            case 'instruments':
                className = 'clipboard';
                break;
            case 'level-down':
                isAwesome = true;
                break;
            case 'level-up':
                isAwesome = true;
                break;
            case 'logout':
                className = 'power';
                break;
            case 'member':
            case 'members':
                className = 'person';
                break;
            case 'organization':
            case 'organizations':
                className = 'sitemap';
                isAwesome = true;
                break;
            case 'people':
                className = 'people';
                break;
            case 'pdf':
                isAwesome = true;
                className = 'file-pdf-o';
                break;
            case 'resources':
            case 'resource':
                className = 'school';
                break;
            case 'save':
                isAwesome = true;
                className = 'cloud-upload';
                break;
            case 'schedule':
                className = 'calendar';
                break;
            case 'configuration':
            case 'settings':
            case 'setting':
                className = 'settings';
                break;
            case 'outcome':
            case 'outcomes':
                className = 'speedometer';
                break;
            case 'weight':
            case 'weights':
                isAwesome = true;
                className = 'balance-scale';
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