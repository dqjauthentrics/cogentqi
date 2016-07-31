import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "icon"
})

export class Icon implements PipeTransform {
    transform(standardName: string): string {
        let className: string = standardName;
        switch (standardName) {
            case 'help':
                className = 'help';
                break;
            case 'dashboard':
                className = 'pulse';
                break;
            case 'people':
                className = 'people';
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
        }
        return className;
    }
}
